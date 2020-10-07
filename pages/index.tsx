import React, { useEffect } from "react"
import router from "next/router"

import Layout from "../layout/Layout";

export default function HomePage() {
  useEffect(() => {
    router.push('/profile')
  })
  return (
    <Layout><div /></Layout>
  );
}
