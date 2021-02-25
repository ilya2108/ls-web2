import React from 'react';
import Layout from "../../layout/Layout";

import plagiats from './json/res_semester_anonymized_pretty.json';

import PlagiatsList from '../../components/Plagiarism/PlagiatsList';
import PlagiaristTable from '../../components/Plagiarism/PlagiaristTable';

export default function users() {
    return (
        <Layout>
            <h1>Plagiarism</h1>

            <h2>Table of plagirists</h2>
            <PlagiaristTable plagiats={plagiats} />

            <h2>List of all plagiats</h2>
            <PlagiatsList plagiats={plagiats} />
        </Layout>
    );
}