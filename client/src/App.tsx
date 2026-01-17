import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/navbar";
import Home from "@/pages/home";
import CreateHealthId from "@/pages/create-healthid";
import WalletSetup from "@/pages/wallet-setup";
import AiRecommendation from "@/pages/ai-recommendation";
import Schemes from "@/pages/schemes";
import ClaimSchemes from "@/pages/claim-schemes";
import PayHospital from "@/pages/pay-hospital";
import Receipt from "@/pages/receipt";
import Wallet from "@/pages/wallet";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/create-healthid" component={CreateHealthId} />
        <Route path="/wallet-setup" component={WalletSetup} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/ai-recommendation" component={AiRecommendation} />
        <Route path="/schemes" component={Schemes} />
        <Route path="/claim-schemes" component={ClaimSchemes} />
        <Route path="/pay-hospital" component={PayHospital} />
        <Route path="/receipt" component={Receipt} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
