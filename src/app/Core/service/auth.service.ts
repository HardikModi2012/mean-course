// import {Inject, Injectable} from '@angular/core';
// import {apiRoutes} from '../constants/api-path.constants';
// import {ScreenIdList} from '../enums/screen-id-list.enum';
// import {ApiService} from './api.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly _destroying$ = new Subject<void>();

//   @SessionStorage('userRights', [])
//   private userRightsListForUpdateOnly: any = [];
//   private userRights$ = new BehaviorSubject<any>([]);
//   public userRights = this.userRights$.asObservable();

//   @SessionStorage('userData', {})
//   private userDataStore!: UserData;

//   private userData$ = new BehaviorSubject<UserData>(new UserData());
//   public userData = this.userData$.asObservable();

//   private _screenList: any = {};
//   public get screenList() {
//     return this._screenList as ScreenListType;
//   }
//   private set screenList(value: any) {
//     this._screenList = value as ScreenListType;
//   }

//   private _currentScreen = {};
//   public get currentScreen() {
//     return this._currentScreen as CurrentScreen;
//   }
//   private setCurrentScreen(value: CurrentScreen) {
//     document.title = `Pedigri - ${value.name}`;
//     this._currentScreen = value;
//   }

//   /**
//    * @ignore
//    *
//    * @private
//    * @memberof DesignService
//    */
//   private divisionLocationPopupFlag$ = new BehaviorSubject<boolean>(false);

//   /**
//    * Show hide Division Location Popup
//    *
//    * @memberof DesignService
//    */
//   public divisionLocationPopupFlag = this.divisionLocationPopupFlag$.asObservable();

//   constructor(
//     @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
//     // private msalService: MsalService,
//     // private msalBroadcastService: MsalBroadcastService,
//     private api: ApiService,
//     // private storage: SessionStorageService,
//     // private notificationS: NotificationService
//   ) {}

//   logout() {
//     sessionStorage.clear();
//     localStorage.clear();
//     // this.storage.clear();
//     thoughtspotLogout();
//     // this.msalService.instance.logout();
//     // const account = this.msalService.instance.getActiveAccount();
//     // if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
//     //   this.msalService.logoutPopup({
//     //     account,
//     //     postLogoutRedirectUri: environment.AUTH_POST_LOGOUT_REDIRECT_URI(),
//     //     mainWindowRedirectUri: '/'
//     //   });
//     // } else {
//     //   this.msalService.logoutRedirect({
//     //     account,
//     //     postLogoutRedirectUri: environment.AUTH_POST_LOGOUT_REDIRECT_URI()
//     //   });
//     // }
//   }

//   ngOnDestroy(): void {
//     this._destroying$.next(undefined);
//     this._destroying$.complete();
//   }

//   openLoginPopup() {
//     // if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
//     //   if (this.msalGuardConfig.authRequest) {
//     //     this.msalService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest).subscribe((response: AuthenticationResult) => {
//     //       this.msalService.instance.setActiveAccount(response.account);
//     //     });
//     //   } else {
//     //     this.msalService.loginPopup().subscribe((response: AuthenticationResult) => {
//     //       this.msalService.instance.setActiveAccount(response.account);
//     //     });
//     //   }
//     // } else {
//     //   if (this.msalGuardConfig.authRequest) {
//     //     this.msalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
//     //   } else {
//     //     this.msalService.loginRedirect();
//     //   }
//     // }
//   }

//   getUserRights(params: any = {}) {
//     // const {screenCode, callFrom} = params;
//     // let roleGuardResult: any = {};

//     // return this.api
//     //   .post(`${apiRoutes.getUserRights}`, {
//     //     screenId: screenCode || null
//     //   })
//     //   .pipe(
//     //     map((success: any) => {
//     //       if (success.length === 0) {
//     //         this.notificationS.show({
//     //           content: 'You are not authorized to access this page',
//     //           animation: {
//     //             duration: 100,
//     //             type: 'slide'
//     //           },
//     //           cssClass: `k-notification-error`,
//     //           hideAfter: 5000,
//     //           position: {
//     //             vertical: 'bottom',
//     //             horizontal: 'right'
//     //           }
//     //         });
//     //       }
//     //       const filteredData = success.filter((src: CurrentScreen) => {
//     //         src.parentId = src.parentId || undefined;
//     //         if (typeof src.breadcrumbPath === 'string' && !!src.breadcrumbPath) {
//     //           src.breadcrumbPath = src.breadcrumbPath?.split('|||');
//     //         } else {
//     //           src.breadcrumbPath = [];
//     //         }
//     //         if (+src.permission !== 0 || !isNaN(+src.permission)) {
//     //           return src;
//     //         }
//     //         return false;
//     //       });

//     //       const screenListArray = this.sortMenuList(filteredData);

//     //       if (screenListArray.length > 1) {
//     //         this.userRightsListForUpdateOnly = screenListArray;
//     //         this.setScreenList();
//     //         this.userRights$.next(this.userRightsListForUpdateOnly);

//     //         if (!!screenCode) {
//     //           roleGuardResult = this.userRightsListForUpdateOnly.find((screen: CurrentScreen) => screen.id === screenCode);
//     //           this.setCurrentScreen(roleGuardResult);
//     //         }
//     //       } else if (screenListArray.length === 1) {
//     //         roleGuardResult = screenListArray[0];
//     //         const index = this.userRightsListForUpdateOnly.findIndex((screen: CurrentScreen) => screen.id === roleGuardResult.id);
//     //         this.userRightsListForUpdateOnly[index || 0] = screenListArray[0];
//     //         this.userRights$.next(this.userRightsListForUpdateOnly);
//     //         this.screenList[roleGuardResult.id] = roleGuardResult;
//     //         this.setCurrentScreen(roleGuardResult);
//     //       }

//     //       if (callFrom === 'RoleGuard') {
//     //         return roleGuardResult;
//     //       } else {
//     //         return this.userRightsListForUpdateOnly;
//     //       }
//     //     })
//     //   );
//   }

//   setScreenList() {
//     const screenList = this.userRightsListForUpdateOnly.reduce((obj: {[key in string]: CurrentScreen}, screen: CurrentScreen) => {
//       obj[screen.id] = screen;
//       return obj;
//     }, {});

//     this.screenList = screenList;
//   }

//   setUserData() {
//     // this.api.get(apiRoutes.getUseInfo, {}).subscribe({
//     //   next: (success: UserData) => {
//     //     this.userDataStore.company = success.company?.trim();
//     //     this.userDataStore.companyAddress = success.companyAddress?.trim();
//     //     this.userDataStore.companyCode = success.companyCode?.trim();
//     //     this.userDataStore.country = success.country?.trim();
//     //     this.userDataStore.currency = success.currency?.trim();
//     //     this.userDataStore.emailId = success.emailId?.trim();
//     //     this.userDataStore.fslCode = success.fslCode?.trim();
//     //     this.userDataStore.groupId = success.groupId?.trim();
//     //     this.userDataStore.name = success.name?.trim();
//     //     this.userDataStore.trasCloseDate = success.trasCloseDate?.trim();
//     //     this.userDataStore.userId = success.userId?.trim();
//     //     this.userDataStore.yearCode = success.yearCode?.trim();
//     //     this.userDataStore.vendorCode = success.vendorCode?.trim();
//     //     this.userDataStore.vendorName = success.vendorName?.trim();
//     //     this.userDataStore.exchangeRate = success.exchangeRate?.trim();
//     //     this.userDataStore.serviceRoles = success.serviceRoles;

//     //     this.userDataStore.allowDivisionChange = success.allowDivisionChange === true ? true : false;
//     //     this.userDataStore.allowEdit = success.allowEdit === true ? true : false;
//     //     this.userDataStore.allowLocationChange = success.allowLocationChange === true ? true : false;
//     //     this.userDataStore.isDateChanges = success.isDateChanges === true ? true : false;
//     //     this.userDataStore.isDeliveryOrder = success.isDeliveryOrder === true ? true : false;
//     //     this.userDataStore.isDemoPartner = success.isDemoPartner === true ? true : false;
//     //     this.userDataStore.isDemoOrder = success.isDemoOrder === true ? true : false;
//     //     this.userDataStore.allowedMultipleLabelPrint = success.allowedMultipleLabelPrint === true ? true : false;
//     //     this.userDataStore.allowedApproveOrReject = success.allowedApproveOrReject === true ? true : false;

//     //     this.refreshUserData();
//     //   },
//     //   error: (error) => {
//     //     console.error(error);

//     //     try {
//     //       error.error = JSON.parse(error.error);
//     //     } catch (err) {
//     //       console.log('🚀 ~ showError ', err);
//     //     }

//     //     this.notificationS.show({
//     //       content: error.error.message || error.message || error,
//     //       animation: {
//     //         duration: 100,
//     //         type: 'slide'
//     //       },
//     //       cssClass: `k-notification-error`,
//     //       hideAfter: 5000,
//     //       position: {
//     //         vertical: 'bottom',
//     //         horizontal: 'right'
//     //       }
//     //     });
//     //   }
//     // });
//   }

//   updateUserLogin() {
//     // this.api.put(apiRoutes.updateUserLogin, {}).subscribe({});
//   }

//   refreshUserData() {
//     // let info: any;
//     // this.msalBroadcastService.msalSubject$.subscribe((res: EventMessage) => {
//     //   info = res;
//     // });
//     // setTimeout(() => {
//     //   const userData: UserData = {
//     //     company: this.userDataStore?.company?.trim(),
//     //     companyAddress: this.userDataStore?.companyAddress?.trim(),
//     //     companyCode: this.userDataStore?.companyCode?.trim(),
//     //     country: this.userDataStore?.country?.trim(),
//     //     currency: this.userDataStore?.currency?.trim(),
//     //     divisionCode: this.userDataStore?.divisionCode?.trim(),
//     //     divisionName: this.userDataStore?.divisionName?.trim(),
//     //     emailId: this.userDataStore?.emailId?.trim(),
//     //     fslCode: this.userDataStore?.fslCode?.trim(),
//     //     groupId: this.userDataStore?.groupId?.trim(),
//     //     locationCode: this.userDataStore?.locationCode?.trim(),
//     //     locationName: this.userDataStore?.locationName?.trim(),
//     //     name: info?.payload?.account?.name?.trim() || this.userDataStore?.name?.trim(),
//     //     trasCloseDate: this.userDataStore?.trasCloseDate,
//     //     userId: this.userDataStore?.userId?.trim(),
//     //     yearCode: this.userDataStore?.yearCode?.trim(),
//     //     vendorCode: this.userDataStore?.vendorCode?.trim(),
//     //     vendorName: this.userDataStore?.vendorName?.trim(),
//     //     serviceRoles: this.userDataStore?.serviceRoles,
//     //     exchangeRate: this.userDataStore?.exchangeRate,
//     //     userName: info?.payload?.account?.username?.trim() || this.userDataStore?.userName?.trim(),
//     //     allowedMultipleLabelPrint: this.userDataStore?.allowedMultipleLabelPrint,
//     //     allowedApproveOrReject: this.userDataStore?.allowedApproveOrReject,
//     //     allowDivisionChange: this.userDataStore?.allowDivisionChange,
//     //     allowEdit: this.userDataStore?.allowEdit === true ? true : false,
//     //     allowLocationChange: this.userDataStore?.allowLocationChange,
//     //     isDateChanges: this.userDataStore?.isDateChanges,
//     //     isDeliveryOrder: this.userDataStore?.isDeliveryOrder,
//     //     isDemoPartner: this.userDataStore?.isDemoPartner,
//     //     isDemoOrder: this.userDataStore?.isDemoOrder
//     //   };

//     //   this.userDataStore = userData;
//     //   this.userDataStore = this.userDataStore;

//     //   this.userData$.next(userData);
//     // }, 0);
//   }

//   checkDivisionLocationCode() {
//     const divisionCode = this.userDataStore?.divisionCode;
//     const locationCode = this.userDataStore?.locationCode;

//     if (!divisionCode || !locationCode) {
//       this.openDivisionOrLocationPopup();
//     }
//   }

//   setDivisionLocationCode({
//     divisionCode,
//     divisionName,
//     locationCode,
//     locationName
//   }: {
//     divisionCode: string;
//     divisionName: string;
//     locationCode: string;
//     locationName: string;
//   }) {
//     if (!this.userDataStore) {
//       this.userDataStore = new UserData();
//     }
//     this.userDataStore.divisionCode = divisionCode?.trim();
//     this.userDataStore.divisionName = divisionName?.trim();
//     this.userDataStore.locationCode = locationCode?.trim();
//     this.userDataStore.locationName = locationName?.trim();

//     this.setUserData();
//     this.refreshUserData();
//   }

//   getDivisionLocationCode() {
//     return {
//       companyCode: this.userDataStore?.companyCode?.trim(),
//       divisionCode: this.userDataStore?.divisionCode?.trim(),
//       locationCode: this.userDataStore?.locationCode?.trim()
//     };
//   }

//   private checkForConditionsToInclude(screen: CurrentScreen): boolean {
//     if (+screen.permission === 0) {
//       return false;
//     }

//     /* Show Only if Flash Division Start */
//     // if (
//     //   [
//     //     ScreenIdList.FLASH_DEFECTIVE_ORDER_UPDATE.toString(),
//     //     ScreenIdList.FLASH_ORDER_ACKNOWLEDGEMENT.toString(),
//     //     ScreenIdList.FLASH_ORDER_NOTES.toString()
//     //   ].includes(screen.id) &&
//     //   !FlashVendorConst.includes(this.userDataStore?.vendorCode ?? '')
//     // ) {
//     //   return false;
//     // }
//     // if (
//     //   [ScreenIdList.DEMO.toString(), ScreenIdList.DEMO_INVOICE.toString(), ScreenIdList.DEMO_RETURN.toString()].includes(screen.id) &&
//     //   this.userDataStore.isDemoOrder !== true
//     // ) {
//     //   return false;
//     // }
//     // if (
//     //   screen.id === 'REVENUE_GP_TREND' &&
//     //   ![
//     //     'samkitjogani@pedigritechnologies.com',
//     //     'senthil@pedigritechnologies.com',
//     //     'pramod@pedigritechnologies.com',
//     //     'khalid@pedigritechnologies.com',
//     //     'ptgtdev1@koohijigrp.net'
//     //   ].includes(this.userDataStore?.emailId || '')
//     // ) {
//     //   return false;
//     // }

//     return true;
//   }

//   openDivisionOrLocationPopup() {
//     this.divisionLocationPopupFlag$.next(true);
//   }

//   closeDivisionOrLocationPopup() {
//     this.divisionLocationPopupFlag$.next(false);
//   }

//   sortMenuList(screenList: Array<CurrentScreen>) {
//     screenList.forEach((src: any) => {
//       src.indexToSort = src.order.split('_');
//     });

//     const data = screenList.sort((a: any, b: any) => {
//       const level = a.indexToSort.length - b.indexToSort.length;
//       if (level === 0) {
//         let index = 0;
//         do {
//           if (+a.indexToSort[index] - +b.indexToSort[index] === 0) {
//             index++;
//           } else if (+a.indexToSort[index] - +b.indexToSort[index] < 0) {
//             return -1;
//           } else {
//             return 1;
//           }
//         } while (a.indexToSort.length !== index);
//         return 1;
//       } else if (level < 0) {
//         return -1;
//       } else {
//         return 1;
//       }
//     });

//     return data;
//   }

//   private checkForRolePermission(data: CurrentScreen, role: keyof typeof RoleType): boolean {
//     let hasPermission = false;
//     switch (role) {
//       case 'CREATE': {
//         hasPermission = +data.permission.charAt(RoleType.CREATE) === 1 ? true : false;
//         break;
//       }
//       case 'READ': {
//         hasPermission = +data.permission.charAt(RoleType.READ) === 1 ? true : false;
//         break;
//       }
//       case 'UPDATE': {
//         hasPermission = +data.permission.charAt(RoleType.UPDATE) === 1 ? true : false;
//         break;
//       }
//       case 'DELETE': {
//         hasPermission = +data.permission.charAt(RoleType.DELETE) === 1 ? true : false;
//         break;
//       }
//       case 'PRINT': {
//         hasPermission = +data.permission.charAt(RoleType.PRINT) === 1 ? true : false;
//         break;
//       }
//       case 'CANCEL': {
//         hasPermission = +data.permission.charAt(RoleType.CANCEL) === 1 ? true : false;
//         break;
//       }
//     }
//     return hasPermission;
//   }

//   roleGuard(userRole: RoleGuardInterface): boolean {
//     const data = this.screenList[userRole.screenId];
//     let hasPermission = false;

//     if (!!data && this.checkForConditionsToInclude(data)) {
//       if (!!userRole?.roles && userRole?.roles?.length > 0) {
//         if (!!userRole?.role) {
//           alert("Don't Use Role and Roles Together");
//         } else {
//           for (let role of userRole?.roles) {
//             if (this.checkForRolePermission(data, role)) {
//               hasPermission = true;
//               break;
//             }
//           }
//         }
//       } else if (!!userRole?.role) {
//         hasPermission = this.checkForRolePermission(data, userRole?.role);
//       }

//       if ((hasPermission && !userRole.reverse) || (!hasPermission && !!userRole.reverse)) {
//         return true;
//       } else {
//         return false;
//       }
//     } else {
//       return false;
//     }
//   }
// }
