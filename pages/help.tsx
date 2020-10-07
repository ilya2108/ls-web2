import Layout from "../layout/Layout";

export default function HelpPage() {
  return (
    <Layout>
        <h1>Help</h1>
        <h2>Assignment Scoring</h2>
        <br />

        <section>
          <p>
            Max points without penalisation: <b>1.0</b> without bonus,{" "}
            <b>1.0</b> with bonus
          </p>
          <p>
            Max points with penalisation: <b>1</b> without bonus, <b>1</b> with
            bonus
          </p>
          <p>
            No of submissions: <b>6</b> (max <b>999</b>, and <b>999</b>{" "}
            available, <b>0%</b> penalty after exceeding the limit)
          </p>
          <p>
            Number of hints "test name": <b>0</b> (max <b>999</b>, and{" "}
            <b>999</b> available, <b>0%</b> penalty after exceeding the limit)
          </p>
          <p>
            Number of hints "test description": <b>0</b> (max <b>999</b>, and{" "}
            <b>999</b> available, <b>0%</b> penalty after exceeding the limit)
          </p>
          <p>
            Number of hints "input data": <b>0</b> (max <b>999</b>, and{" "}
            <b>999</b> available, <b>0%</b> penalty after exceeding the limit)
          </p>
          <p>
            Number of hints "output": <b>0</b> (max <b>999</b>, and <b>999</b>{" "}
            available, <b>0%</b> penalty after exceeding the limit)
          </p>
          <p>
            Total penalisation: <strong>0%</strong>
          </p>
        </section>

        <h2>Reporting bugs and asking questions</h2>
        <p>
          Please, report any issues or improvement ideas <a href="https://gitlab.fit.cvut.cz/learnshell-2.0/learnshell-2-issues/issues">on GitLab.</a>
        </p>

        {/* <section>
          <p>
            <a href="http://127.0.0.1:8000/admin">Django admin</a>
          </p>
          <p>
            <a href="http://127.0.0.1:8000/graphql">GraphiQL</a>
          </p>
          <p>
            Report issues —{" "}
            <a href="https://gitlab.fit.cvut.cz/groups/LearnShell/-/issues">
              gitlab.fit.cvut.cz/LearnShell/app_issues
            </a>
          </p>
          <p>
            LS development —{" "}
            <a href="https://gitlab.fit.cvut.cz/jilekka2/ls">
              gitlab.fit.cvut.cz/jilekka2/ls
            </a>
          </p>
        </section> */}
    </Layout>
  );
}
