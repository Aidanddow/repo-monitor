import moment from 'moment';

export const formatDate = (unformattedDate: string, showTime: boolean) => {
  // const date = new Date(unformattedDate);
  // const monthNames = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December"
  // ];

  // const day = date.getUTCDate();
  // const monthIndex = date.getMonth();
  // const year = date.getFullYear();
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // log("date moment", moment.utc(unformattedDate).format("Do MMMM YYYY"));
  // log(
  //   "time moment",
  //   moment.utc(unformattedDate).format("Do MMMM YYYY, h:mm a")
  // );
  return showTime
    ? moment.utc(unformattedDate).format('YYYY/MM/DD  , h:mm a')
    : moment.utc(unformattedDate).format('YYYY/MM/DD');
};
export const isValidEmail = (email: string) => {
  const regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return regexp.test(email);
};

export const getLastWeeksDate=()=> {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
}
export const log = (...value: any[]) => {
  // tslint:disable-next-line: no-console
  console.log(...value);
};

export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, value);
};

export const getLocalStorage = (key: string) => localStorage.getItem(key);
// export const addorUpdate = (array: Template[], object: Template, type: string) => {
//   const index = array.findIndex(item => item.tab_name === type);
//   if (index === -1) {
//     return [...array, object]
//   }
//   const newArray = array;
//   newArray[index] = object;
//   return newArray;
// }

export const initialTabTemplate = (tab_name: number) => {
  return {
    tab_name: tab_name,
    is_navbar: true,
    is_coverpic: false,
    is_sidebar: false,
    navbar_tabs: true,
    navbar_bgcolor: '#ffffff',
    navbar_brand_text: 'mysite',
    navbar_brand_color: '#00000',
    sidebar_image: '',
    sidebar_text: 'text',
    sidebar_bgcolor: '#ffffff'
  };
};
export const initialScheduler = {
  disableDate: [''],
  disableDay: [''],
  startDate: '',
  endDate: '',
  disableWeekends: false,
  disableSundays: false
};
