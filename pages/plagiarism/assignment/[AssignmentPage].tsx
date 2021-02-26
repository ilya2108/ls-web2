import React from 'react';
import { useRouter } from "next/router";
import Layout from "../../../layout/Layout";

import allPlagiats from '../__fixtures__/res_semester_anonymized_pretty.json';

import PlagiatsList from '../../../components/Plagiarism/PlagiatsList';

export default function AssignmentPage() {
    const router = useRouter();
    const assignmentName: string = Array.isArray(router.query.AssignmentPage) ? router.query.AssignmentPage[0] : router.query.AssignmentPage
    const plagiats = allPlagiats.filter(plagiat => { return plagiat.culprit_assignment_name === assignmentName})
    return (
        <Layout>
            <PlagiatsList plagiats={plagiats} />
        </Layout>
    );
}
