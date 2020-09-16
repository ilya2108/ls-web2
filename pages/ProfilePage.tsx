// documentation
// https://atlaskit.atlassian.com/packages/design-system/table-tree

// atlaskit
import TableTree, { Headers, Header, Rows, Row, Cell } from '@atlaskit/table-tree';

// layout components
import Layout from "../layout/Layout";

const results = [
  {
    id: 1,
    content: {
      'asd': 'asd', 
    },
    hasChildren: true,
    task: 'Tasks',
    children: [
      {
        id: 11,
        task: 'EN-001-Hello, BIE-PS1!',
        points: 1.000,
      }
    ]
  },
  {
    id: 2,
    hasChildren: true,
    task: 'Exams',
    children: [
      {
        id: 21,
        task: '03 2019 - (st 7:30) Adresare II',
        points: 2.207,
      },
      {
        id: 22,
        task: 'en-06-2019 (St 18:00) Filters I',
        points: 7.218,
      },
      {
        id: 23,
        task: 'en-08-2019 (St 16:15) Big test 1',
        points: 30.000,
      },
      {
        id: 24,
        task: 'en-08-2019 (St 16:15) Big test 1a',
        points: 32.897,
      },
      {
        id: 25,
        task: 'en-09-2019 (St 16:15) RE',
        points: 10.150,
      },
    ]
  },
]

export default function ProfilePage() {
  return (
    <Layout>
      <h1>Profile name</h1>
        <section>
          Username: <strong>username</strong><br />
          Email: <strong>email</strong><br />
          Role: <strong>role</strong>
        </section>
        <br />

        <section>
          <div>
            <TableTree>
              <Headers>
                <Header width={300}>Task</Header>
                <Header width={100}>Points</Header>
              </Headers>
              <Rows
                items={results}
                render={({ task, points, id, children }) => (
                  <Row
                    isDefaultExpanded
                    expandLabel="Expand"
                    collapseLabel="Collapse"
                    itemId={id}
                    items={children}
                    hasChildren={children && children.length > 0}
                  >
                    <Cell singleLine>{task}</Cell>
                    <Cell singleLine>{points}</Cell>
                  </Row>
                )}
              />
            </TableTree>
          </div>
        </section>
    </Layout>
  );
}
