import React, { ReactNode, useState, useEffect } from 'react';
import {
  Outlet, BrowserRouter, Navigate, Route, Routes
} from 'react-router-dom';
import { useAuth } from "@hooks/AuthContext";
import QueryParam from "@i18n/query"
import ScrollToTop from '@hooks/ScrollHook';

// Components and Layouts
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Dashboard_Layout from "@pages/dashboard"

// Home
import About from "@pages/home/about";
import Terms from "@pages/home/terms";
import Policy from "@pages/home/privacy-police";
import Home from "@pages/home";
import Smurf from "@pages/home/smurfs";
import VIP from "@pages/home/vip";
import SignIn from "@pages/auth/signIn";
// Jogos
import Lol from "@pages/games/lol";
import WildRift from "@pages/games/wr";
// import Valorant from "@pages/games/valorant";
import TFT from "@pages/games/tft";
// import CsGo from "@pages/games/csgo";

// Dashboard - Admin
import Admin from "@pages/dashboard/[admin]";
import ClientAdm from "@pages/dashboard/[admin]/client";
import FeedbackAdm from "@pages/dashboard/[admin]/client/feedback";
import BoostersAdm from "@pages/dashboard/[admin]/team/boosters";
import CandidatesAdm from "@pages/dashboard/[admin]/team/candidates";
import AdminsAdm from "@pages/dashboard/[admin]/team/admins";
import SmurfAdm from "@pages/dashboard/[admin]/smurf";
import StreamingAdm from "@pages/dashboard/[admin]/streaming";
import RouletteAdm from "@pages/dashboard/[admin]/streaming/roulette";
import CouponsAdm from "@pages/dashboard/[admin]/tools/coupons";
import DuoBoostAdm from "@pages/dashboard/[admin]/tools/duoBoost";
import ResultAdm from "@pages/dashboard/[admin]/results";
import PriceAdm from "@pages/dashboard/[admin]/tools/price";

// Dashboard - Booster
import Booster from "@pages/dashboard/[booster]";
import AccountsBooster from "@pages/dashboard/[booster]/accounts";
import HistoricBooster from '@pages/dashboard/[booster]/historic';

// Dashboard - Client
import Client from "@pages/dashboard/[client]";
import RouletteClient from '@pages/dashboard/[client]/roulette';
import SmurfClient from '@pages/dashboard/[client]/smurf';
import StreamClient from '@pages/dashboard/[client]/streaming';
import VipClient from '@pages/dashboard/[client]/vip';
import ChatClient from '@pages/dashboard/[client]/chat';

// Service
import api from '@services/api';
import SignUp from '@pages/auth/signUp';
import Apply from '@pages/home/work';
import Profile from '@pages/dashboard/profile';
import NotFound from '@pages/notFound';
import Loading from '@pages/loading';
import Roleta from '@pages/dashboard/[client]/roulette/roleta';
import Store from '@pages/dashboard/[client]/store';
import ManageAdm from '@pages/dashboard/[admin]/streaming/manage';
import Chat from '@components/Chat';
import Awaiting from '@pages/awaitingPayment';
import ForgotPassword from '@pages/auth/forgotPassword';
import Valorant from '@pages/games/valorant';
import LolService from '@pages/games/lol';
import WildRiftService from '@pages/games/wr';
import { pages as lolPages } from '@components/Lol/homeLol';
import { pages as wildRiftPages } from "@components/WR/homeWildRift";
import { pages as TFTPages } from "@components/TFT/homeTFT";
import { pages as ValPages } from "@components/Valorant/homeValorant";
import { pages as CSGOPages } from "@components/CSGO/homeCs";
import CSGOService from '@pages/games/csgo';

// import CSGO from '@pages/games/csgo';


interface PrivateRouteProps {
  children: ReactNode;
  redirectTo: string;
}

interface RoleRouteProps {
  redirectTo: string;
  children: ReactNode;
  userTypePerm: "ADMIN" | "CLIENT" | "BOOSTER"
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, redirectTo }) => {
  const { user, signOut } = useAuth();

  if (user) {
    return <>{children}</>;
  }
  return <Navigate to={redirectTo} />;
};

const RoleRoute: React.FC<RoleRouteProps> = ({ redirectTo, children, userTypePerm }) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    async function getSessionData() {
      try {
        const token = localStorage.getItem('@EloMania:token');
        const response = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        localStorage.setItem('@EloMania:user', JSON.stringify(data));
        setUserType(data.type_permission);
        setLoading(false);
      } catch (error) {
        console.log('Failed to get session data:', error);
        setLoading(false);
      }
    }
    getSessionData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (userType === userTypePerm) {
    return <>{children}</>;
  }
  signOut();
  return <Navigate to={redirectTo} />;
};

const Routing = () => {
  const { user } = useAuth();
  const [isTopOfPage, setIsTopOfPage] = useState(true);

  const HomeLayout = () => {
    return (
      <>
        <ScrollToTop />
        <Navbar
          linkSetName="home"
          isTopOfPage={isTopOfPage}
          setIsTopOfPage={setIsTopOfPage}
          showDiscordButton={true} />
        <Outlet />
        <Footer />
      </>
    );
  }


  const LoL_Layout = () => {
    return (
      <>
              {/* <ScrollToTop /> */}
        <Navbar
          linkSetName="lol"
          isTopOfPage={isTopOfPage}
          setIsTopOfPage={setIsTopOfPage} showDiscordButton={false} />
        <Outlet />
        <Footer />
      </>
    );
  }

  const Wild_Layout = () => {
    return (
      <>
        <Navbar
          linkSetName="wild"
          isTopOfPage={isTopOfPage}
          setIsTopOfPage={setIsTopOfPage} showDiscordButton={false} />
        <Outlet />
        <Footer />
      </>
    );
  }

  const Valorant_Layout = () => {
    return (
      <>
        <Navbar
          linkSetName="valorant"
          isTopOfPage={isTopOfPage}
          setIsTopOfPage={setIsTopOfPage} showDiscordButton={false} />
        <Outlet />
        <Footer />
      </>
    );
  }

  const TeamF_Layout = () => {
    return (
      <>
        <Navbar
          linkSetName="teamfight"
          isTopOfPage={isTopOfPage}
          setIsTopOfPage={setIsTopOfPage} showDiscordButton={false} />
        <Outlet />
        <Footer />
      </>
    );
  }

  const CSGO_Layout = () => {
    return (
      <>
        <Navbar
          linkSetName="csgo"
          isTopOfPage={isTopOfPage}
          setIsTopOfPage={setIsTopOfPage} showDiscordButton={false} />
        <Outlet />
        <Footer />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomeLayout />}>
          <Route
            path="/"
            element={<>
              <QueryParam language="pt-br" />
              <Home />
            </>}
          />
          <Route
            path="about"
            element={<>
              <QueryParam language="pt-br" />
              <About />
            </>}
          />
          <Route
            path="terms"
            element={<Terms />}
          />
          <Route
            path="apply"
            element={<Apply />}
          />
          <Route
            path="privacy-police"
            element={<Policy />}
          />
          <Route
            path="smurf"
            element={<Smurf />}
          />
          {/* <Route
            path="vip"
            element={<VIP />}
          /> */}
          {/* Aguardando Pagamento */}
          {<Route
            path="awaiting"
            element={<Awaiting />}
          />}
        </Route>
        {/* Rotas LoL */}
        <Route path="/lol" element={<LoL_Layout />}>
          <Route
            path="/lol"
            element={<LolService
              initialSelectedService={"ELOJOB (ELO BOOST)"}
              pageData={lolPages.home}
            />}
          />
          <Route
            path="eloboost"
            element={<LolService
              initialSelectedService={"ELOJOB (ELO BOOST)"}
              pageData={lolPages.eloBoost}
            />}
          />
          <Route
            path="coach"
            element={<LolService
              initialSelectedService={"COACH"}
              pageData={lolPages.coach}
            />}
          />
          <Route
            path="md5"
            element={<LolService
              initialSelectedService={"MD10 LOL"}
              pageData={lolPages.md10}
            />}
          />
          <Route
            path="wins"
            element={<LolService
              initialSelectedService={"VITÓRIAS AVULSAS"}
              pageData={lolPages.vitorias}
            />}
          />
          <Route
            path="manutencao-de-elo"
            element={<LolService
              initialSelectedService={"MANUTENÇÃO DE ELO"}
              pageData={lolPages.manutencaoElo}
            />}
          />
        </Route>


        {/* Rotas Wild Rift */}
        <Route path="/wildrift" element={<Wild_Layout />}>
          <Route
            path="/wildrift"
            element={<WildRiftService initialSelectedService={'ELOJOB (ELO BOOST)'} pageData={wildRiftPages.home} />
            }
          />
          <Route
            path="eloboost"
            element={<WildRiftService initialSelectedService={'ELOJOB (ELO BOOST)'} pageData={wildRiftPages.eloBoost} />}
          />
          <Route
            path="coach"
            element={<WildRiftService initialSelectedService={'COACH'} pageData={wildRiftPages.coach} />}
          />
          <Route
            path="md10"
            element={<WildRiftService initialSelectedService={'MD10 Wild'} pageData={wildRiftPages.md10} />}
          />
          <Route
            path="wins"
            element={<WildRiftService initialSelectedService={'VITÓRIAS AVULSAS'} pageData={wildRiftPages.vitorias} />}
          />
        </Route>

        {/* Rotas Valorant */}
      <Route path="/valorant" element={<Valorant_Layout />}>
          <Route
            path="/valorant"
            element={<Valorant initialSelectedService={'ELOJOB (ELO BOOST)'} pageData={ValPages.home}/>}
          />
                  <Route
            path="eloboost"
            element={<Valorant initialSelectedService={'ELOJOB (ELO BOOST)'} pageData={ValPages.eloBoost}/>}
          />
          <Route
            path="coach"
            element={<Valorant initialSelectedService={'COACH'} pageData={ValPages.coach}/>}
          />
          <Route
            path="md5"
            element={<Valorant initialSelectedService={'MD5 Val'} pageData={ValPages.md5}/>}
          />
          <Route
            path="wins"
            element={<Valorant initialSelectedService={'VITÓRIAS AVULSAS'} pageData={ValPages.vitorias}/>}
          />
        </Route>


        {/* Rotas Teamfight */}
        <Route path="/teamfight" element={<TeamF_Layout />}>
          <Route
            path="/teamfight"
            element={<TFT initialSelectedService={'ELOJOB (ELO BOOST)'} pageData={TFTPages.home} />}
          />
          <Route
            path="eloboost"
            element={<TFT initialSelectedService={'ELOJOB (ELO BOOST)'} pageData={TFTPages.eloBoost} />}
          />
          <Route
            path="md5"
            element={<TFT initialSelectedService={'MD5 TFT'} pageData={TFTPages.md5} />}
          />
          <Route
            path="coach"
            element={<TFT initialSelectedService={'COACH'} pageData={TFTPages.coach} />}
          />
          <Route
            path="wins"
            element={<TFT initialSelectedService={'VITÓRIAS AVULSAS'} pageData={TFTPages.vitorias} />}
          />
        </Route>

        {/* Rotas CSGO */}
       <Route path="/csgo" element={<CSGO_Layout />}>
           <Route
            path="/csgo"
            element={<CSGOService initialSelectedService={'mm'} pageData={CSGOPages.home} />}
          />
          <Route
            path="matchmaking"
            element={<CSGOService initialSelectedService={'mm'} pageData={CSGOPages.matchmaking} />}
          />
          <Route
            path="gc"
            element={<CSGOService initialSelectedService={'gc'} pageData={CSGOPages.gc} />}
          />
        </Route> 

        {/* Rotas Privadas */}

        {user && user.type_permission === "ADMIN" ?
          <Route path="/dashboard" element={
            <PrivateRoute redirectTo="/login">
              <RoleRoute userTypePerm="ADMIN" redirectTo='/login'>
                <Dashboard_Layout userType="ADMIN" />
              </RoleRoute>
            </PrivateRoute>
          }>
            <Route
              path="/dashboard"
              element={<Admin />}
            />
            <Route
              path="client"
              element={<ClientAdm />}
            />
            <Route
              path="feedback"
              element={<FeedbackAdm />}
            />
            <Route
              path="boosters"
              element={<BoostersAdm />}
            />
            <Route
              path="candidates"
              element={<CandidatesAdm />}
            />
            <Route
              path="admins"
              element={<AdminsAdm />}
            />
            <Route
              path="smurf"
              element={<SmurfAdm />}
            />
            <Route
              path="streaming"
              element={<StreamingAdm />}
            />
            <Route
              path="roulette"
              element={<RouletteAdm />}
            />
            <Route
              path="manage"
              element={<ManageAdm />}
            />
            <Route
              path="price"
              element={<PriceAdm />}
            />
            <Route
              path="coupons"
              element={<CouponsAdm />}
            />
            <Route
              path="duoboost"
              element={<DuoBoostAdm />}
            />
            <Route
              path="result"
              element={<ResultAdm />}
            />
            <Route
              path="profile"
              element={<Profile />}
            />
            <Route
              path="chat/:id"
              element={<ChatClient />}
            />
          </Route>
          : null}


        {user && user.type_permission === "BOOSTER" ?
          <Route path="/dashboard" element={
            <PrivateRoute redirectTo="/login">
              <RoleRoute userTypePerm="BOOSTER" redirectTo='/login'>
                <Dashboard_Layout userType="BOOSTER" />
              </RoleRoute>
            </PrivateRoute>
          }>
            <Route
              path="/dashboard"
              element={<Booster />}
            />
            <Route
              path="accounts"
              element={<AccountsBooster />}
            />
            <Route
              path="historic"
              element={<HistoricBooster />}
            />
            <Route
              path="profile"
              element={<Profile />}
            />
            <Route
              path="chat/:id"
              element={<ChatClient />}
            />
          </Route> : null
        }

        {user && user.type_permission === "CLIENT" ?
          <Route path="/dashboard" element={
            <PrivateRoute redirectTo="/login">
              <RoleRoute userTypePerm="CLIENT" redirectTo='/login'>
                <Dashboard_Layout userType="CLIENT" />
              </RoleRoute>
            </PrivateRoute>
          }>
            <Route
              path="/dashboard"
              element={<Client />}
            />
            <Route
              path="roulette"
              element={<RouletteClient />}
            />
            <Route
              path="lol"
              element={<Store />}
            />
            <Route
              path="streaming"
              element={<StreamClient />}
            />
            <Route
              path="smurfs"
              element={<SmurfClient />}
            />
            <Route
              path="rewards"
              element={<VipClient />}
            />
            <Route
              path="chat/:id"
              element={<ChatClient />}
            />
            <Route
              path="profile"
              element={<Profile />}
            />
          </Route> : null
        }
        <Route path="/login" element={
          <>
            <QueryParam language="pt-br" />
            <SignIn />
          </>
        } />
        <Route path="/cadastro" element={
          <>
            <QueryParam language="pt-br" />
            <SignUp />
          </>
        } />
        <Route path="/forgot-password" element={
          <>
            <QueryParam language="pt-br" />
            <ForgotPassword />
          </>
        } />
        {/* 
        <Route path="/roleta" element={
          <>
            <QueryParam language="pt-br" />
            <Roleta />
          </>
        } /> */}

        <Route path="*" element={
          <>
            <QueryParam language="pt-br" />
            <NotFound />
          </>
        } />
      </Routes >
    </BrowserRouter>
  );
};

export default Routing;
