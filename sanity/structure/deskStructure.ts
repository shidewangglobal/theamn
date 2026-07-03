import type { StructureResolver } from 'sanity/structure';

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('THE AMN')
    .items([
      S.listItem()
        .title('Live on website')
        .child(
          S.documentList()
            .title('Published insights')
            .filter('_type == "insight" && draft != true')
            .defaultOrdering([{ field: 'publishDate', direction: 'desc' }]),
        ),
      S.listItem()
        .title('Hidden / drafts')
        .child(
          S.documentList()
            .title('Hidden insights')
            .filter('_type == "insight" && draft == true')
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('Featured')
        .child(
          S.documentList()
            .title('Featured insights')
            .filter('_type == "insight" && featured == true && draft != true'),
        ),
      S.divider(),
      S.listItem()
        .title('All insights')
        .child(
          S.documentList()
            .title('All insights')
            .filter('_type == "insight"')
            .defaultOrdering([{ field: 'publishDate', direction: 'desc' }]),
        ),
    ]);
