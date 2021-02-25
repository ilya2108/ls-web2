import React from 'react';
import { useRouter } from "next/router";
import Layout from "../../../layout/Layout";

import allPlagiats from '../json/res_semester_anonymized_pretty.json';

import PlagiatsList from '../../../components/Plagiarism/PlagiatsList';
import PlagiaristCoworkers from '../../../components/Plagiarism/PlagiaristCoworkers';

export default function UserPage() {

    const router = useRouter();
    const userEmail: string = Array.isArray(router.query.UserPage) ? router.query.UserPage[0] : router.query.UserPage
    const plagiats = allPlagiats.filter(plagiat => { return plagiat.culprits.includes(userEmail)})
    return (
        <Layout>
            <h1>User: {userEmail}</h1>

            <h2>Most common coworkers</h2>
            <PlagiaristCoworkers plagiats={plagiats} userEmail={userEmail} />

            <h2>All plagiats:</h2>
            <PlagiatsList plagiats={plagiats} highlightUser={userEmail}/>
        </Layout>
    );
}