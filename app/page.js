'use client';
import { useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import SplashScreen from './screens/splash/Splash';
import LoginScreen from './screens/login/Login';
import RegisterScreen from './screens/register/Register';
import FingerprintScreen from './screens/fingerprint/Fingerprint';
import UnlockPINScreen from './screens/unlock-pin/UnlockPIN';
import DashboardScreen from './screens/dashboard/Dashboard';
import ServicesScreen from './screens/services/Services';
import RewardsScreen from './screens/rewards/Rewards';
import AirtimeScreen from './screens/airtime/Airtime';
import DataScreen from './screens/data/Data';
import CableScreen from './screens/cable/Cable';
import ElectricityScreen from './screens/electricity/Electricity';
import ExamPinsScreen from './screens/exam-pins/ExamPins';
import BettingScreen from './screens/betting/Betting';
import ConfirmPaymentScreen from './screens/confirm-payment/ConfirmPayment';
import EnterPinScreen from './screens/enter-pin/EnterPin';
import CreatePinScreen from './screens/create-pin/CreatePin';
import ProcessingScreen from './screens/processing/Processing';
import PaymentSuccessScreen from './screens/payment-success/PaymentSuccess';
import PaymentFailedScreen from './screens/payment-failed/PaymentFailed';
import AddMoneyScreen from './screens/add-money/AddMoney';
import HistoryScreen from './screens/history/History';
import ProfileScreen from './screens/profile/Profile';
import ProfileInfoScreen from './screens/profile-info/ProfileInfo';
import NotificationsScreen from './screens/notifications/Notifications';
import HelpSupportScreen from './screens/help-support/HelpSupport';
import DownloadStatementScreen from './screens/download-statement/DownloadStatement';
import VirtualNumbersScreen from './screens/virtual-numbers/VirtualNumbers';
import GiftCardScreen from './screens/giftcard/GiftCard';
import KYCOverviewScreen from './screens/kyc/KYCOverview';
import KYCBvnNinScreen from './screens/kyc/KYCBvnNin';
import KYCSelfieScreen from './screens/kyc/KYCSelfie';
import KYCUploadIdScreen from './screens/kyc/KYCUploadId';
import KYCProcessingScreen from './screens/kyc/KYCProcessing';
import KYCVerifiedScreen from './screens/kyc/KYCVerified';
import KYCFailedScreen from './screens/kyc/KYCFailed';

export default function App() {
  const { screen, direction } = useApp();

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen />;
      case 'splash-to-dash':
        return <SplashScreen nextScreen="dashboard" />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'fingerprint':
        return <FingerprintScreen />;
      case 'unlock-pin':
        return <UnlockPINScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'rewards':
        return <RewardsScreen />;
      case 'airtime':
        return <AirtimeScreen />;
      case 'data':
        return <DataScreen />;
      case 'cable':
        return <CableScreen />;
      case 'electricity':
        return <ElectricityScreen />;
      case 'exam':
        return <ExamPinsScreen />;
      case 'betting':
        return <BettingScreen />;
      case 'confirm-payment':
        return <ConfirmPaymentScreen />;
      case 'enter-pin':
        return <EnterPinScreen />;
      case 'create-pin':
        return <CreatePinScreen />;
      case 'processing':
        return <ProcessingScreen />;
      case 'payment-success':
        return <PaymentSuccessScreen />;
      case 'payment-failed':
        return <PaymentFailedScreen />;
      case 'add-money':
        return <AddMoneyScreen />;
      case 'transactions':
        return <HistoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'profile-info':
        return <ProfileInfoScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'help-support':
        return <HelpSupportScreen />;
      case 'download-statement':
        return <DownloadStatementScreen />;
      case 'virtual-numbers':
        return <VirtualNumbersScreen />;
      case 'giftcard':
        return <GiftCardScreen />;
      case 'kyc-overview':
        return <KYCOverviewScreen />;
      case 'kyc-bvn-nin':
        return <KYCBvnNinScreen />;
      case 'kyc-selfie':
        return <KYCSelfieScreen />;
      case 'kyc-upload-id':
        return <KYCUploadIdScreen />;
      case 'kyc-processing':
        return <KYCProcessingScreen />;
      case 'kyc-verified':
        return <KYCVerifiedScreen />;
      case 'kyc-failed':
        return <KYCFailedScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const animClass = direction === 'forward'
    ? 'anim-slide-forward'
    : direction === 'back'
    ? 'anim-slide-back'
    : 'anim-tab-switch';

  const isTabScreen = ['dashboard', 'services', 'rewards', 'profile'].includes(screen);

  return (
    <>
      <div key={screen} className={`screen ${animClass}`} style={{ paddingBottom: isTabScreen ? '72px' : undefined }}>
        {renderScreen()}
      </div>
      {isTabScreen && <BottomNav />}
    </>
  );
}
