import React from "react";
import CMS from "netlify-cms-app";
import { de } from "netlify-cms-locales";

// Import main site styles as a string to inject into the CMS preview pane
import styles from "!to-string-loader!css-loader!postcss-loader!sass-loader!../css/main.css";

import HomePreview from "./cms-preview-templates/home";
import PostPreview from "./cms-preview-templates/post";
import RanglistePreview from "./cms-preview-templates/rangliste";

CMS.registerPreviewStyle(styles, { raw: true });
CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("rangliste", RanglistePreview);
CMS.registerLocale("de", de);
CMS.init();
