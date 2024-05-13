import React, { Fragment, useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoadingScreen from "../screens/loading/LoadingScreen";
import WelcomeBackScreen from "../screens/welcome/WelcomeBackScreen";
import SignUpScreen from "../screens/signup/SignUpScreen";
import VerifyOPTScreen from "../screens/verifyOTP/VerifyOPTScreen";
import ForgotPasswordScreen from "../screens/password/ForgotPasswordScreen";
import CreateNewPassword from "../screens/password/CreateNewPassword";
import CreateAccountScreen from "../screens/createaccount/CreateAccountScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import HotelDetailScreen from "../screens/HotelDetailScreen";
import SignInScreen from "../screens/signin/SignInScreen";
import HomeScreen from "../screens/home/HomeScreen";
import TabNavigation from "./navigationBottomTab";
import SearchDestinationScreen from "../screens/SearchDestinationScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import ChatItemScreen from "../screens/chat/ChatItemScreen";
import ResortList from "../screens/resort/ResortList";
import DetailResort from "../screens/resort/DetailResort";
import ImageFullResort from "../screens/resort/ImageFullResort";
import ImageFullApartment from "../screens/apartment/ImageFullApartment";
import InputInfomationScreen from "../screens/paymentProcess/InputInfomationScreen";
import PaymentScreen from "../screens/paymentProcess/PaymentScreen";
import BookingConfirm from "../screens/bookingConfirm/BookingConfirm";
import BookedApartment from "../screens/bookedApartment/BookedApartment";
import ManageRevervation from "../screens/ManageRevervation/ManageRevervation";
import NotificationScreen from "../screens/notification/NotificationScreen";
import Wallet from "../screens/wallet/Wallet";
import HelpCenter from "../screens/helpCenter/HelpCenter";
import GuestToMember from "../screens/guestToMember/GuestToMember";
import Landing from "../screens/addApartment/Landing";
import WellcomeBackAdd from "../screens/addApartment/WellcomeBackAdd";
import StartAdd from "../screens/addApartment/StartAdd";
import StepAdd1 from "../screens/addApartment/StepAdd1";
import DetailProperty from "../screens/property/DetailProperty";
import DetailApartment from "../screens/apartment/DetailApartment";
import ImageFullProperty from "../screens/property/ImageFullProperty";
import ListProperty from "../screens/property/ListProperty";
import ManageAccount from "../screens/manageAccount/ManageAccount";
import Rating from "../screens/rating/Rating";
import SearchApartment from "../screens/home/SearchApartment";
import StepAdd2 from "../screens/addApartment/StepAdd2";
import StepAdd3 from "../screens/addApartment/StepAdd3";
import StepAdd4 from "../screens/addApartment/StepAdd3";
import StepAdd5 from "../screens/addApartment/StepAdd4";
import YourTrip from "../screens/yourTrip/YourTrip";
import Recharge from "../screens/rechart/Recharge";
import SpecialReq from "../screens/specialRequirement/SpecialReq";
import YourApartment from "../screens/yourApartment/YourApartment";
import OwnerDetailApartment from "../screens/apartment/OwnerDetailApartment";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import VNPAYPaymentScreen from "../screens/payment/VNPayScreen";
import { jwtDecode } from "jwt-decode";
import { loadTokenExp, loadUser } from "../redux/actions/userActions";
import { useJwt } from "react-jwt";
import PostBlog from "../screens/postBlog/PostBlog";
import BlogComunity from "../screens/blogComunity/BlogComunity";
import FullHistoryTransaction from "../screens/viewFullTransactionHistory/FullHistoryTransaction";
import OwnerBooking from "../screens/ownerBooking/OwnerBooking";
import BookingDetail from "../screens/bookingDetail/BookingDetail";
import BlogDetail from "../screens/blogDetail/BlogDetail";
import Tranfer from "../screens/tranfer/Tranfer";
import { Client } from "@stomp/stompjs";
import { stompContext, StompEventTypes, withSocket } from "../services/socket";
import * as Notifications from "expo-notifications";
import ChangePassword from "../screens/changePassword/ChangePassword";
import OwnerBookingDetail from "../screens/ownerBookingDetail/OwnerBookingDetail";
import useLogout from "../hooks/useLogout";
import ListResort from "../screens/listResort/ListResort";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function Navigation() {
  const { user, userProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [wsState, setWsState] = useState("Not Connected");
  const [loading, setLoading] = useState(true);
  const logout = useLogout();
  const isLogout = logout.isLogout;

  const setToken = (token) => {
    return SecureStore.setItemAsync("secure_token", token);
  };
  const getToken = () => {
    return SecureStore.getItemAsync("secure_token");
  };

  const [authen, setAuthen] = useState(
    getToken().then((token) => setAuthen(token))
  );

  const removeToken = async () => {
    await SecureStore.deleteItemAsync("secure_token");
  };

  useEffect(() => {
    if (user) {
      setToken(user.access_token);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.access_token) {
      stompContext?.removeStompClient();
      stompContext.addStompEventListener(StompEventTypes.Connect, () => {
        setWsState("Connected");
      });
      stompContext.addStompEventListener(StompEventTypes.Disconnect, () => {
        setWsState("Disconnected");
      });
      stompContext.addStompEventListener(StompEventTypes.WebSocketClose, () => {
        setWsState("Disconnected (not graceful)");
      });
      stompContext.newStompClient(
        "https:///api.holiday-swap.click/websocket",
        user.access_token,
        dispatch
      );
    }
  }, [user]);

  useEffect(() => {
    if (authen) {
      dispatch(loadUser());
    }
  }, [authen]);

  const { decodedToken } = useJwt(authen);
  useEffect(() => {
    if (decodedToken?.exp < Math.floor(Date.now() / 1000)) {
      // Token has expired, remove it from SecureStore
      removeToken();
    }
  }, [decodedToken]);

  useEffect(() => {
    if (isLogout === true) {
      logout.onLogoutReset();
    }
  }, [isLogout]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authen ? (
          <Fragment>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen
              name="root"
              component={TabNavigation}
              options={({ navigation }) => {
                if (decodedToken?.exp < Math.floor(Date.now() / 1000)) {
                  // Token has expired, remove it from SecureStore
                  removeToken();
                  logout.onLogout();
                  navigation.navigate("SignInScreen");
                }
              }}
            />

            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ListResort" component={ListResort} />

            {/* <Stack.Screen name="Loading" component={LoadingScreen} /> */}
            <Stack.Screen
              name="OwnerDetailApartment"
              component={OwnerDetailApartment}
            />
            <Stack.Screen name="YourApartment" component={YourApartment} />
            <Stack.Screen name="StepAdd2" component={StepAdd2} />
            <Stack.Screen name="SpecialReq" component={SpecialReq} />
            <Stack.Screen name="Recharge" component={Recharge} />
            <Stack.Screen name="YourTrip" component={YourTrip} />
            <Stack.Screen name="PostBlog" component={PostBlog} />
            <Stack.Screen name="Tranfer" component={Tranfer} />
            <Stack.Screen name="BlogComunity" component={BlogComunity} />
            <Stack.Screen name="BookingDetail" component={BookingDetail} />
            <Stack.Screen name="BlogDetail" component={BlogDetail} />

            <Stack.Screen name="VNPAYPayment" component={VNPAYPaymentScreen} />

            <Stack.Screen
              name="FullHistoryTransaction"
              component={FullHistoryTransaction}
            />
            <Stack.Screen name="StartAdd" component={StartAdd} />
            <Stack.Screen name="StepAdd3" component={StepAdd3} />
            <Stack.Screen name="StepAdd4" component={StepAdd4} />
            <Stack.Screen
              name="InputInfomationScreen"
              component={InputInfomationScreen}
            />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="SearchApartment" component={SearchApartment} />
            <Stack.Screen name="DetailApartment" component={DetailApartment} />
            <Stack.Screen name="Rating" component={Rating} />
            <Stack.Screen name="ManageAccount" component={ManageAccount} />
            <Stack.Screen name="BookingConfirm" component={BookingConfirm} />
            <Stack.Screen name="DetailProperty" component={DetailProperty} />
            {isLogout && (
              <Stack.Screen name="SignInScreen" component={SignInScreen} />
            )}
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="StepAdd1" component={StepAdd1} />
            <Stack.Screen name="WellcomeBackAdd" component={WellcomeBackAdd} />
            <Stack.Screen name="GuestToMember" component={GuestToMember} />
            <Stack.Screen name="ChatItemScreen" component={ChatItemScreen} />
            <Stack.Screen name="ImageFullResort" component={ImageFullResort} />
            <Stack.Screen name="HelpCenter" component={HelpCenter} />
            <Stack.Screen name="Wallet" component={Wallet} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="OwnerBooking" component={OwnerBooking} />
            <Stack.Screen
              name="OwnerBookingDetail"
              component={OwnerBookingDetail}
            />
            <Stack.Screen
              name="ManageRevervation"
              component={ManageRevervation}
            />
            <Stack.Screen name="BookedApartment" component={BookedApartment} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen
              name="ImageFullApartment"
              component={ImageFullApartment}
            />
            <Stack.Screen
              name="ImageFullProperty"
              component={ImageFullProperty}
            />
            <Stack.Screen
              name="HotelDetailScreen"
              component={HotelDetailScreen}
            />
            {withSocket(
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
            )}

            <Stack.Screen name="ResortList" component={ResortList} />
            <Stack.Screen name="DetailResort" component={DetailResort} />
            <Stack.Screen name="ListProperty" component={ListProperty} />
            <Stack.Screen
              name="CreateAccountScreen"
              component={CreateAccountScreen}
            />
            <Stack.Screen
              name="SearchDestinationScreen"
              component={SearchDestinationScreen}
            />
            {/* <Stack.Screen name="WelcomeScreen" component={OnboardingScreen} /> */}
            <Stack.Screen
              name="WelcomeBackScreen"
              component={WelcomeBackScreen}
            />
          </Fragment>
        ) : (
          <Fragment>
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="CreateNewPassword"
              component={CreateNewPassword}
            />
            <Stack.Screen name="VerifyOTP" component={VerifyOPTScreen} />
          </Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
