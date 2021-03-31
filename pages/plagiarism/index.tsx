import React from "react";
import Layout from "../../layout/Layout";

import plagiats from "./__fixtures__/res_semester_anonymized_pretty.json";

import PlagiatsList from "../../components/Plagiarism/PlagiatsList";
import CulpritsTable from "../../components/Plagiarism/CulpritsTable";
import PlagiatsNetworkGraph from "../../components/Plagiarism/CulpritsGraph/CulpritsNetworkGraph";
import PlagiarismDownload from "../../components/Plagiarism/PlagiarismDownload";

export default function users() {
  return (
    <Layout>
      <h1>Plagiarism</h1>
      <PlagiarismDownload plagiats={plagiats} />

      <h2 className="mb-3">Graph of culprits</h2>
      <PlagiatsNetworkGraph plagiats={plagiats} />

      <h2 className="mb-3">Table of culprits</h2>
      <CulpritsTable plagiats={plagiats} />

      <h2 className="mb-3">List of all plagiats</h2>
      <PlagiatsList plagiats={plagiats} />
    </Layout>
  );
}
