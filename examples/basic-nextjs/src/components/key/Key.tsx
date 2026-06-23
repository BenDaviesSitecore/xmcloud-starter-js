import { JSX } from "react";
import {
  RichText as ContentSdkRichText,
  Field,
  Placeholder,
} from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import StructuredData from "components/structured-data/StructuredData";
import { buildProductJsonLd } from "src/lib/structured-data/schema";

interface Fields {
  KeyTitle: Field<string>;
}

type PromoProps = ComponentProps & {
  fields: Fields;
};

interface PromoContentProps extends PromoProps {
  renderText: (fields: Fields) => JSX.Element;
}

const PromoContent = (props: PromoContentProps): JSX.Element => {
  const { fields, params, renderText } = props;
  const { styles, RenderingIdentifier: id } = params;

  const Wrapper = ({ children }: { children: JSX.Element }): JSX.Element => (
    <article
      className={`component promo ${styles}`}
      id={id}
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="component-content">{children}</div>
    </article>
  );

  if (!fields) {
    return (
      <Wrapper>
        <span className="is-empty-hint">Promo</span>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <>
        <div className="promo-text" itemProp="description">
          {renderText(fields)}
        </div>
        <StructuredData
          id={`jsonld-product-${id ?? "promo"}`}
          data={buildProductJsonLd({
            descriptionHtml: fields.KeyTitle?.value
              ? String(fields.KeyTitle.value)
              : undefined,
          })}
        />
      </>
    </Wrapper>
  );
};

export const Default = (props: PromoProps): JSX.Element => {
  const phKey = `key-${props.params.DynamicPlaceholderId}`;

  const renderText = (fields: Fields) => (
    <>
      <div className="field-promotext">
        <ContentSdkRichText field={fields.KeyTitle} />
        <Placeholder name={phKey} rendering={props.rendering} />
      </div>
    </>
  );

  return <PromoContent {...props} renderText={renderText} />;
};
