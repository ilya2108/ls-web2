import React, { useState } from "react";

import { CSVLink } from "react-csv";
import Button from "@atlaskit/button";
import Select from "@atlaskit/select";

import { ScriptDescriptor } from '../../utils/plagiarism/plagiarism.types'
type PropType = {
  plagiats: ScriptDescriptor[];
};

enum formatOptions {
  CSV = "csv",
  JSONMinified = "jsonminified",
  JSONPretty = "jsonpretty",
}

type SelectedFormatType = {
  label: string;
  value: string;
};

export default function PlagiarismDownload({ plagiats }: PropType) {
  const filename = "plagiarism";
  const csvHeaders = [
    { label: "Assignment name", key: "culprit_assignment_name" },
    { label: "Culprit count", key: "culprit_count" },
    { label: "Culprits", key: "culprits" },
  ];

  const [selectedFormat, setSelectedFormat] = useState("");

  return (
    <div className="plagiarism-download-wrapper mt-4">
      <Select
        className="plagiarism-download-select mr-5"
        onChange={(newValue) => {
          setSelectedFormat((newValue as SelectedFormatType).value);
        }}
        options={Object.keys(formatOptions).map((key) => {
          return { label: key, value: formatOptions[key] }
        })}
        placeholder="Choose export format"
      />

      { selectedFormat === "csv" &&
      <CSVLink
      data={plagiats}
      headers={csvHeaders}
      filename={`${filename}.csv`}
      className="plagiarism-download"
      >
        <Button>
          Download
        </Button>
      </CSVLink>}

      { selectedFormat === "jsonminified" &&
      <a
        className="plagiarism-download"
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(plagiats)
        )}`}
        download={`${filename}-min.json`}
      >
        <Button>
          Download
        </Button>
      </a>}

      { selectedFormat === "jsonpretty" &&
      <a
        className="plagiarism-download"
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(plagiats, null, 2)
        )}`}
        download={`${filename}-pretty.json`}
      >
        <Button>
          Download
        </Button>
      </a>}

      { selectedFormat === "" &&
        <Button isDisabled>
          Download
        </Button>
      }

    </div>
  );
}
