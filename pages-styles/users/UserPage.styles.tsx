import styled from "styled-components";

export const Table = styled.section`
    width: 600px;

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 10px;
`;

export const Header = styled.article`
    margin-bottom: 30px;

    grid-column: 1 / -1;

    h1 {
        margin-bottom: 10px;
    }
`;

export const HTag = styled.span`
    margin-right: 10px;
`;

export const HRow = styled.div`
    margin-bottom: 5px;
`

export const Row = styled.article`
    padding: 10px 0 10px 0;

    grid-column: 1 / -1;

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 10px;
`;

export const LeftCell = styled.div`
    text-align: left;
    /* padding: 0 5px 0 5px; */

    grid-column: 1;
`;

export const RightCell = styled.div`
    text-align: left;
    /* padding: 0 5px 0 5px; */

    grid-column: 2;
`;