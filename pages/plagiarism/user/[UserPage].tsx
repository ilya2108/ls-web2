import React from 'react';
import { useRouter } from "next/router"
import Layout from "../../../layout/Layout"
import Link from 'next/link'

import allPlagiats from '../__fixtures__/res_semester_anonymized_pretty.json'

import PlagiatsList from '../../../components/Plagiarism/PlagiatsList'
import CulpritCoworkers from '../../../components/Plagiarism/CulpritCoworkers'
import PlagiatsNetworkGraph from '../../../components/Plagiarism/PlagiatsNetworkGraph'

export default function UserPage() {

    const router = useRouter();
    const userEmail: string = Array.isArray(router.query.UserPage) ? router.query.UserPage[0] : router.query.UserPage
    const plagiats = allPlagiats.filter(plagiat => { return plagiat.culprits.includes(userEmail)})
    return (
        <Layout>
            <h1>User: {userEmail}</h1>

            <Link href={"/plagiarism/"}>
                <a>Back to all plagiats</a>
            </Link>

            <h2 className="mb-3">Graph of culprits</h2>
            <PlagiatsNetworkGraph plagiats={allPlagiats} mainCulprit={userEmail} />

            <h2 className="mb-3">Most common coworkers</h2>
            <CulpritCoworkers plagiats={plagiats} userEmail={userEmail} />

            <h2 className="mb-3">All plagiats:</h2>
            <PlagiatsList plagiats={plagiats} highlightUser={userEmail}/>
        </Layout>
    );
}
