import styled from 'styled-components'

export const NivoWrapper = styled.div`
    display: grid;

    grid-template-areas:
    "settings graph nodes";

    grid-template-columns: minmax(160px, 15%) auto minmax(190px, 15%);
    grid-template-rows: minmax(500, 1000);

    border: 1px solid #eee;
    border-radius: 5px;

    width: 100%;
    height: 100%;
    max-height: 800px;

    @media (max-width: 1500px) and (min-width: 1000px) {
        grid-template-areas:
        "settings settings"
        "graph nodes";

        max-height: 1500px;

        grid-template-columns: auto minmax(190px, 15%);
        grid-template-rows: auto minmax(500px, 1fr);
    }

    @media (max-width: 1000px) {
        grid-template-areas:
        "settings"
        "graph"
        "nodes";

        max-height: 2000px;

        grid-template-columns: 100%;
        grid-template-rows: auto minmax(500px, 1fr) minmax(300px, 500px);
    }
`

export const NivoGraph = styled.div`
    grid-area: graph;

    border-right: 1px solid #eee;
    border-left: 1px solid #eee;

    max-height: inherit;
    width: inherit;
    min-width: 0;
    height: inherit;

    @media (max-width: 1500px) and (min-width: 1000px) {
        border: 0;
        border-right: 1px solid #eee;
        border-top: 1px solid #eee;
    }

    @media (max-width: 1000px) {
        border: 0;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }
`

export const NivoSettings = styled.div`
    grid-area: settings;

    padding: 5px;

    max-height: inherit;

    overflow: auto;
`

export const NivoNodes = styled.div`
    grid-area: nodes;
    overflow-y: scroll;
    border: 0;

    padding: 5px;

    max-height: inherit;

    overflow: auto;

    @media (max-width: 1500px) and (min-width: 1000px) {
        border: 0;
        border-top: 1px solid #eee;
    }
`


export const SettingGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-bottom: 1px solid #eee;
`

export const SettingRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

export const RangeWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & > span {
        max-width: 40px;
        text-align: center;
        margin: auto;
        padding-right: 3px;
    }

    & > input {
        max-width: calc(100% - 40px)
    }
`
