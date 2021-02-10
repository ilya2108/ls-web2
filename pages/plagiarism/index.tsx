import React from 'react';
import Layout from "../../layout/Layout";

import plagiats from './json/res_semester_anonymized_pretty.json';

import PlagiatsList from '../../components/Plagiarism/PlagiatsList';

export default function users() {
    return (
        <Layout>
            <PlagiatsList plagiats={plagiats} />
        </Layout>
    );
}