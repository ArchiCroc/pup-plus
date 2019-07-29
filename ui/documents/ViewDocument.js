import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import { Meteor } from 'meteor/meteor';
import SEO from '../components/SEO';
import BlankState from '../components/BlankState';
import Comments from './components/Comments';
import { document as documentQuery } from './queries/Documents.gql';
import commentAdded from './subscriptions/Comments.gql';
import parseMarkdown from '../../modules/parseMarkdown';
import CommentComposer from './components/CommentComposer';

import { StyledViewDocument, DocumentBody } from './StyledViewDocument';

const ViewDocument = ({ match }) => {
  const { loading, data, subscribeToMore } = useQuery(documentQuery, {
    variables: {
      _id: match.params._id,
    },
  });
  console.log('subscribeToMore', subscribeToMore);

  // componentWillMount() {
  //   const { data } = this.props;
  //   if (Meteor.isClient && Meteor.userId()) data.refetch();
  // }

  if (!loading && data.document) {
    return (
      <React.Fragment>
        <StyledViewDocument>
          <SEO
            title={data.document && data.document.title}
            description={data.document && data.document.body}
            url={`documents/${data.document && data.document._id}`}
            contentType="article"
            published={data.document && data.document.createdAt}
            updated={data.document && data.document.updatedAt}
            twitter={Meteor.settings.public.twitterUsername}
          />
          <React.Fragment>
            <h1>{data.document && data.document.title}</h1>
            <DocumentBody
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(data.document && data.document.body),
              }}
            />
          </React.Fragment>
        </StyledViewDocument>
        {/* <CommentComposer documentId={data.document && data.document._id} /> */}
        {/* <Comments
          subscribeToNewComments={() =>
            subscribeToMore({
              document: commentAdded,
              variables: {
                documentId: data.document && data.document._id,
              },
              updateQuery: (existingData, { subscriptionData }) => {
                if (!subscriptionData.data) return existingData;
                const newComment = subscriptionData.data.commentAdded;
                return {
                  document: {
                    ...existingData.document,
                    comments: [...existingData.document.comments, newComment],
                  },
                };
              },
            })
          }
          documentId={data.document && data.document._id}
          comments={data.document && data.document.comments}
        /> */}
      </React.Fragment>
    );
  }

  if (!data.loading && !data.document) {
    return (
      <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title={i18n.__('blank_state_title')}
        subtitle={i18n.__('blank_state_subtitle')}
      />
    );
  }

  return null;
};

ViewDocument.propTypes = {
  match: PropTypes.object.isRequired,
};

export default ViewDocument;
