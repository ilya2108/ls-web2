import styled from 'styled-components'

export const NivoWrapper = styled.div`
    display: grid;

    grid-template-areas:
    "settings graph nodes";

    grid-template-columns: minmax(130px, 15%) auto minmax(130px, 15%);
    grid-template-rows: auto;

    border: 1px solid #eee;

    width: 100%;
    max-height: 1000px;
`

export const NivoGraph = styled.div`
    grid-area: graph;

    border-right: 1px solid #eee;
    border-left: 1px solid #eee;

    height: 1000px;
    max-height: 1000px;
`

export const NivoSettings = styled.div`
    grid-area: settings;

    padding: 5px;
`

export const NivoNodes = styled.div`
    grid-area: nodes;
    padding: 5px;

    overflow-y: scroll;

    max-height: 1000px
`
