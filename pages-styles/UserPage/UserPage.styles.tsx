import styled from "styled-components";

export const Table = styled.section`
    width: 100%;

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 10px;
`;

export const Header = styled.article`
    margin-bottom: 30px;

    grid-column: 1 / -1;
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
    grid-template-columns: 1fr 1fr 2fr;
    grid-gap: 10px;
`;

export const LeftCell = styled.div`
    text-align: left;

    grid-column: 1;
`;

export const RightCell = styled.div`
    text-align: left;

    grid-column: 2;
`;

export const ButtonCell = styled.div`
    grid-column: 3;
`;
