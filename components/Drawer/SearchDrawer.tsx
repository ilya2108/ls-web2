// documentation
// Drawer: https://atlaskit.atlassian.com/packages/design-system/drawer
// Quick search: https://atlaskit.atlassian.com/packages/search/quick-search

// TODO: Make search logic
import React from "react";
import {
  ObjectResult,
  ResultItemGroup,
  QuickSearch,
} from "@atlaskit/quick-search";

import Avatar from "@atlaskit/avatar";
import ContainerNavigation from "../ContainerNavigation/ContainerNavigation";

const defaultProps = {
  resultId: "result_id",
};

const dummyAvatarComponent = (
  <Avatar
    src="https://hello.atlassian.net/secure/projectavatar?pid=30630"
    appearance="square"
  />
);

const avatarUrl = "https://hello.atlassian.net/secure/projectavatar?pid=30630";

class SearchDrawer extends React.Component<
  {},
  { isLoading: boolean; query: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      query: "",
    };
  }

  search(value?: string) {
    this.setState({
      query: value,
    });
  }

  render() {
    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={({ target }) => {
          if (!target.value) {
            return
          }

          this.search(target.value);
        }}
        value={this.state.query}
      >
        <ResultItemGroup title="Object examples" override>
          <ObjectResult
            {...defaultProps}
            name="quick-search is too hilarious!"
            avatarUrl={avatarUrl}
            objectKey="AK-007"
            containerName="Search'n'Smarts"
          />
          <ObjectResult
            {...defaultProps}
            avatarUrl={avatarUrl}
            name="Yeah, I cut my dev loop in half, but you'll never guess what happened next!"
            containerName="Buzzfluence"
          />
          <ObjectResult
            {...defaultProps}
            avatarUrl={avatarUrl}
            name="Prank schedule: April 2017"
            containerName="The Scream Team"
            isPrivate
          />
          <ObjectResult
            {...defaultProps}
            avatar={dummyAvatarComponent}
            name="This one has an avatar component!"
            containerName="The Scream Team"
            isPrivate
          />
        </ResultItemGroup>
      </QuickSearch>
    );
  }
}
export default SearchDrawer;
