// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract crypD {
    uint256 public campaignCount = 0;

    enum CampaignStatus { Active, Closed, Released }

    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 raised;
        CampaignStatus status;
        bool extended;
        string img;
        string video;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(address => uint256[]) public donatedCampaigns;
    mapping(uint256 => address[]) public campaignDonors;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator);
    event Donated(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event Withdrawn(uint256 indexed campaignId, uint256 amount);
    event CampaignClosed(uint256 indexed campaignId, bool successful);
    event DeadlineExtended(uint256 indexed campaignId, uint256 newDeadline);

    modifier onlyCreator(uint256 _id) {
        require(msg.sender == campaigns[_id].creator, "You are not the campaign creator!");
        _;
    }

    modifier campaignExists(uint256 _id) {
        require(_id > 0 && _id <= campaignCount, "Campaign does not exist!");
        _;
    }

    modifier isActive(uint256 _id) {
        require(campaigns[_id].status == CampaignStatus.Active, "Campaign is not active anymore!");
        _;
    }

    function createCampaign(string memory _title, string memory _description, uint256 _goal, uint256 _deadline, string memory _img, string memory _video) external {
        require(_goal > 0, "Goal must be > 0!");
        require(_deadline > block.timestamp, "Deadline must be in the future!");

        campaignCount++;
        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            deadline: _deadline,
            raised: 0,
            status: CampaignStatus.Active,
            extended: false,
            img: _img,
            video: _video
        });

        emit CampaignCreated(campaignCount, msg.sender);
    }

    function donate(uint256 _id) external payable campaignExists(_id) isActive(_id) {
        Campaign storage c = campaigns[_id];

        if (block.timestamp > c.deadline) {
            closeCampaign(_id);
            return;
        }

        require(msg.value > 0, "Send ETH to donate!");

        uint256 amountAllowed = c.goal - c.raised;
        require(amountAllowed > 0, "Goal is already reached!");

        uint256 donationAmount = msg.value > amountAllowed ? amountAllowed : msg.value;

        if (msg.value > donationAmount) {
            payable(msg.sender).transfer(msg.value - donationAmount);
        }

        if (donations[_id][msg.sender] == 0) {
            donatedCampaigns[msg.sender].push(_id);
            campaignDonors[_id].push(msg.sender);
        }

        donations[_id][msg.sender] += donationAmount;
        c.raised += donationAmount;

        emit Donated(_id, msg.sender, donationAmount);

        if (c.raised == c.goal) {
            closeCampaign(_id);
        }
    }

    function closeCampaign(uint256 _id) public campaignExists(_id) isActive(_id) {
        Campaign storage c = campaigns[_id];
        require(block.timestamp > c.deadline || c.raised >= c.goal, "Can't close the campaign yet!");

        c.status = CampaignStatus.Closed;
        bool successful = c.raised >= c.goal;
        emit CampaignClosed(_id, successful);
    }

    function extendDeadline(uint256 _id, uint256 _newDeadline) external campaignExists(_id) onlyCreator(_id) isActive(_id) {
        Campaign storage c = campaigns[_id];

        require(block.timestamp < c.deadline, "Deadline is already passed!");
        require(!c.extended, "You can extend the deadline only once!");
        require(_newDeadline > c.deadline, "New deadline must be in the future!");

        c.deadline = _newDeadline;
        c.extended = true;

        emit DeadlineExtended(_id, c.deadline);
    }

    function releaseFunds(uint256 _id) external campaignExists(_id) onlyCreator(_id) {
        Campaign storage c = campaigns[_id];
        require(c.status == CampaignStatus.Closed, "Campaign is not closed yet!");
        require(c.raised > 0, "No funds to release!");
        
        uint256 amount = c.raised;
        c.raised = 0;
        c.status = CampaignStatus.Released;

        payable(c.creator).transfer(amount);
        emit Withdrawn(_id, amount);
    }

    //View Functions
    function getDonatedAmount(uint256 _id, address _donor) external view campaignExists(_id) returns (uint256) {
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

    function getCampaignStatus(uint256 _id) external view campaignExists(_id) returns (string memory) {
        Campaign memory c = campaigns[_id];

        if (c.status == CampaignStatus.Released) return "Released";
        if (c.status == CampaignStatus.Closed) return c.raised >= c.goal ? "Closed: Success" : "Closed: Failed";
        if (block.timestamp > c.deadline) return c.raised >= c.goal ? "Closed: Success" : "Closed: Failed";
        return "Active";
    }
}