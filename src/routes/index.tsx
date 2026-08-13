
import { Routes, Route } from "react-router-dom";

import {Home} from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Transaction } from "../pages/Transactions/Transaction";
import { Settings } from "../pages/Settings/Settings";
import { Account } from "../pages/Acounts/Acount";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm/ForgotPasswordForm";

export const AppRoutes =()=> {

  return (


      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/transactions" element={<Transaction />} />

        <Route path="/accounts" element={<Account />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/forgot-password" element={<ForgotPasswordForm />} />

      </Routes>

  );
  
}

export default AppRoutes;