import { mycampaigns, dashboard, allcamp, profile } from '../icons';

export const navlinks = [
  {
    name: 'Dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'All Campaigns',
    imgUrl: allcamp,
    link: '/all-campaigns',
  },
  {
    name: 'My Campaigns',
    imgUrl: mycampaigns,
    link: '/my-campaigns',
  },
  /*
  {
    name: 'payment',
    imgUrl: payment,
    link: '/',
    disabled: true,
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    link: '/',
    disabled: true,
  },
  */
  {
    name: 'Profile',
    imgUrl: profile,
    link: '/profile',
  },
  /*
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },*/
];