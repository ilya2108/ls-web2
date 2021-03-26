import React from "react";

import { CSVLink } from "react-csv";
import Button from "@atlaskit/button";

type Email = string;
type ScriptDescriptor = {
  script: string;
  culprit_assignment_name: string;
  culprit_count: number;
  culprits: Email[];
};
type PropType = {
  plagiats: ScriptDescriptor[];
};

export default function PlagiarismDownload({ plagiats }: PropType) {
  const filename = "plagiarism";
  const csvHeaders = [
    { label: "Assignment name", key: "culprit_assignment_name" },
    { label: "Culprit count", key: "culprit_count" },
    { label: "Culprits", key: "culprits" },
  ];

  return (
    <div className="mt-4">
      <Button>
        <CSVLink
          data={plagiats}
          headers={csvHeaders}
          filename={`${filename}.csv`}
          class="plagiarism-download"
        >
          Download CSV
        </CSVLink>
      </Button>
      <Button className="plagiarism-download">
        <a
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(plagiats)
          )}`}
          download={`${filename}.json`}
        >
          Download JSON
        </a>
      </Button>
      <Button className="plagiarism-download">
        <a
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(plagiats, null, 2)
          )}`}
          download={`${filename}.json`}
        >
          Download JSON Pretty
        </a>
      </Button>
    </div>
  );
}
