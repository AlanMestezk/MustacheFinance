
import { Routes, Route } from "react-router-dom";

import {Home} from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Transaction } from "../pages/Transactions/Transaction";
import { Settings } from "../pages/Settings/Settings";
import { Account } from "../pages/Acounts/Acount";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm/ForgotPasswordForm";
import { NewExpenseForm } from "../components/Dashboard/Expenses/NewExpenseForm";
import { ExpenseList } from "../components/Dashboard/Expenses/ExpenseList";
import { IncomeList } from "../components/Dashboard/Incomes/IncomeList";
import { NewIncomeForm } from "../components/Dashboard/Incomes/NewIncomeForm";
import { NewInvestmentForm } from "../components/Dashboard/Investments/NewInvestmentForm";
import { InvestmentList } from "../components/Dashboard/Investments/InvestmentList";
import { Reports } from "../components/Dashboard/Reports/Reports";

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

        <Route path="/dashboard/expenses/new" element={<NewExpenseForm />}/>

        <Route path="/dashboard/expenses" element={<ExpenseList />}/>

        <Route
          path="/dashboard/investments"
          element={<InvestmentList />}
        />
        
        <Route
          path="/dashboard/reports"
          element={<Reports />}
        />

        <Route path="/dashboard/incomes" element={<IncomeList />}/>

        <Route path="/dashboard/investments/new" element={<NewInvestmentForm />} />

        <Route path="/dashboard/incomes/new" element={<NewIncomeForm />}/>

        <Route path="/dashboard/expenses/edit/:expenseId" element={<NewExpenseForm />}/>
        
      </Routes>

  );
  
}

export default AppRoutes;