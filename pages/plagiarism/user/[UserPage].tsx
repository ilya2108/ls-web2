import React from 'react';
import { useRouter } from "next/router";
import Layout from "../../../layout/Layout";

import allPlagiats from '../json/res_semester_anonymized_pretty.json';

import PlagiatsList from '../../../components/Plagiarism/PlagiatsList';

export default function UserPage() {

    const router = useRouter();
    const userEmail: string = Array.isArray(router.query.UserPage) ? router.query.UserPage[0] : router.query.UserPage
    const plagiats = allPlagiats.filter(plagiat => { return plagiat.culprits.includes(userEmail)})
    return (
        <Layout>
            <PlagiatsList plagiats={plagiats} />
        </Layout>
    );
}