import gql from 'graphql-tag';
import { CountsByTag } from 'modules/common/components';
import { TAG_TYPES } from 'modules/tags/constants';
import { queries as tagQueries } from 'modules/tags/graphql';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { TagsQueryResponse } from '../../../tags/types';
import { queries as companyQueries } from '../../graphql';
import { CountQueryResponse } from '../../types';

const TagFilterContainer = (props: {
  companyCountsQuery: CountQueryResponse;
  tagsQuery: TagsQueryResponse;
}) => {
  const { companyCountsQuery, tagsQuery } = props;

  const counts = companyCountsQuery.companyCounts || {};

  return (
    <CountsByTag
      tags={tagsQuery.tags || []}
      counts={counts.byTag || {}}
      manageUrl="tags/company"
      loading={tagsQuery.loading}
    />
  );
};

export default withProps<{}>(
  compose(
    graphql<{}, CountQueryResponse, { only: string }>(
      gql(companyQueries.companyCounts),
      {
        name: 'companyCountsQuery',
        options: {
          variables: { only: 'byTag' }
        }
      }
    ),
    graphql<{}, TagsQueryResponse, { type: string }>(gql(tagQueries.tags), {
      name: 'tagsQuery',
      options: () => ({
        variables: {
          type: TAG_TYPES.COMPANY
        },
        fetchPolicy: 'network-only'
      })
    })
  )(TagFilterContainer)
);