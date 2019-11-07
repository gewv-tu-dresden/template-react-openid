import React from "react";
import { Layout } from "antd";

import Routes from '../Routes'
import NavHeader from '../components/NavHeader'

export default function MainView() {
  return (
    <Layout>
      <NavHeader />
      <Routes />
    </Layout>
  )
}

