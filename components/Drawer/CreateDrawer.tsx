// new SideNavigation dependencies
import {
    SideNavigation,
    Header,
    NavigationHeader,
    NavigationContent,
    ButtonItem,
    Section,
  } from "@atlaskit/side-navigation";

  import CalendarIcon from "@atlaskit/icon/glyph/calendar";
  import EmojiObjectsIcon from "@atlaskit/icon/glyph/emoji/objects";
  import EmojiNatureIcon from "@atlaskit/icon/glyph/emoji/nature";


// New SideNavigation
const CreateDrawer = () => (
    <SideNavigation label="project">
    <NavigationContent>
      <ButtonItem iconBefore={<CalendarIcon label=""/>}>Start Exam <strong>right now</strong></ButtonItem>
      <ButtonItem iconBefore={<EmojiObjectsIcon label=""/>}>Create Exam</ButtonItem>
      <ButtonItem iconBefore={<EmojiNatureIcon label=""/>}>Create Task</ButtonItem>
    </NavigationContent>
  </SideNavigation>
);

export default CreateDrawer;