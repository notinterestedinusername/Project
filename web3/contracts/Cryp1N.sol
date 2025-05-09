//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Cryp1N is ReentrancyGuard {
    uint256 public campaignCount = 0;

    enum CampaignStatus { Active, Successful, Failed, Released }

    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 raised;
        CampaignStatus status;
        bool goalReached;
        bool extended; 
        string img;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(address => uint256[]) public donatedCampaigns;
    mapping(uint256 => address[]) public campaignDonors;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator);
    event Donated(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event Withdrawn(uint256 indexed campaignId, uint256 amount);
    event CampaignClosed(uint256 indexed campaignId, bool goalReached);
    event DeadlineExtended(uint256 indexed campaignId, uint256 newDeadline);

    modifier onlyCreator(uint256 _id) {
        require(msg.sender == campaigns[_id].creator, "Not campaign creator");
        _;
    }

    modifier isActive(uint256 _id) {
        require(campaigns[_id].status == CampaignStatus.Active, "Campaign not active");
        _;
    }

    modifier campaignExists(uint256 _id) {
        require(_id > 0 && _id <= campaignCount, "Campaign does not exist");
        _;
    }

    function createCampaign(string memory _title, string memory _description, uint256 _goal, uint256 _deadline, string memory _img) external {
        require(_goal > 0, "Goal must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        campaignCount++;
        //campaigns[campaignCount] = Campaign({creator: msg.sender, title: _title, description: _description, goal: _goal, deadline: block.timestamp + (_durationInDays * 1 days), raised: 0, status: CampaignStatus.Active, goalReached: false});
        //check whether the timestamp is working fine or not
        campaigns[campaignCount] = Campaign({creator: msg.sender, title: _title, description: _description, goal: _goal, deadline: _deadline, raised: 0, status: CampaignStatus.Active, goalReached: false, extended: false, img: _img});

        emit CampaignCreated(campaignCount, msg.sender);
    }
    //campaginStatusCheck
    function checkGoal(uint256 _id) external campaignExists(_id) isActive(_id) {
        Campaign storage c = campaigns[_id];
        require(block.timestamp > c.deadline, "Campaign still active");

        if(c.raised >= c.goal) {
            c.goalReached = true;
            c.status = CampaignStatus.Successful;
        } else {
            c.status = CampaignStatus.Failed;
        }
        emit CampaignClosed(_id, c.goalReached);
    }

    function donate(uint256 _id) external payable campaignExists(_id) isActive(_id) nonReentrant {
        Campaign storage c = campaigns[_id];

        if (block.timestamp > c.deadline) {
            this.checkGoal(_id);
            revert("Deadline passed");
        }

        require(msg.value > 0, "Must send ETH to donate");

        uint256 amountAllowed = c.goal - c.raised;
        require(amountAllowed > 0, "Goal already reached");
        
        uint256 donationAmount = msg.value > amountAllowed ? amountAllowed : msg.value;

        if (msg.value > donationAmount) {
            payable(msg.sender).transfer(msg.value - donationAmount);
        }
        // Track new donor and save to donor lists
        if (donations[_id][msg.sender] == 0) {
            donatedCampaigns[msg.sender].push(_id);
            campaignDonors[_id].push(msg.sender);
        }
        // Accept the donation
        donations[_id][msg.sender] += donationAmount;
        c.raised += donationAmount;

        emit Donated(_id, msg.sender, donationAmount);
        // If goal is now met, mark campaign as successful
        if (c.raised == c.goal) {
            c.status = CampaignStatus.Successful;
            c.goalReached = true;
            emit CampaignClosed(_id, true);
        }
    }

    function extendDeadline(uint256 _id, uint256 _newDeadline) external campaignExists(_id) onlyCreator(_id) isActive(_id) {
        Campaign storage c = campaigns[_id];

        require(block.timestamp < c.deadline, "Deadline already passed");
        require(!c.extended, "Deadline can only be extended once");
        require(_newDeadline > c.deadline, "Must extend by atleast 1 day");

        c.deadline = _newDeadline;
        c.extended = true;

        emit DeadlineExtended(_id, c.deadline);
    }

    function releaseFunds(uint256 _id) external campaignExists(_id) onlyCreator(_id) nonReentrant {
        Campaign storage c = campaigns[_id];

        require(c.status == CampaignStatus.Successful || c.status == CampaignStatus.Failed, "Campaign not completed");
        require(c.status != CampaignStatus.Released, "Already withdrawn");

        uint256 amount = c.raised;
        c.raised = 0;
        c.status = CampaignStatus.Released;

        payable(c.creator).transfer(amount);
        emit Withdrawn(_id, amount);
    }


    function getDonatedAmount(uint256 _id, address _donor) external campaignExists(_id) view returns (uint256) {
        return donations[_id][_donor];
    }

    function getMyDonatedCampaigns() external view returns (uint256[] memory) {
        return donatedCampaigns[msg.sender];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory all = new Campaign[](campaignCount);
        for (uint256 i = 0; i < campaignCount; i++) {
            all[i] = campaigns[i + 1];
        }
        return all;
    }

    function getCampaign(uint256 _id) external view campaignExists(_id) returns (Campaign memory) {
        return campaigns[_id];
    }

    function getCampaignDonors(uint256 _id) external view campaignExists(_id) returns (address[] memory) {
        return campaignDonors[_id];
    }
}