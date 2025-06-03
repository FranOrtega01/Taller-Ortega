import React from "react";
import { t } from "../../../../../../../../../customHooks/useTranslation";
import { CollapsibleSection } from "../../../../../../../../../components/common/collapsible-section/CollapsibleSection";

export const Description = ({ description }) => {
    return (
        <CollapsibleSection defaultOpen={false} header={t("description-section-title")}>
            {description && <p>{description}</p>}
        </CollapsibleSection>
    );
};
