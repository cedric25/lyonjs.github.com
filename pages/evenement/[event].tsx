import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { fetchMeetupEvents } from '../../modules/meetup/api';
import _uniq from 'lodash/uniq';
import { ParsedUrlQuery } from 'querystring';
import { dataOverride } from '../../data/data-override';
import _merge from 'lodash/merge';
import { LyonJSHead } from '../../modules/header/LyonJSHead';
import { Event } from '../../modules/event/types';
import { H1 } from '../../modules/atoms/remark/Titles';
import React from 'react';
import { EventDetail } from '../../modules/event/event-detail/EventDetail';
import { EventMarkup } from '../../modules/event/next-event/EventMarkup';

const EventPage: NextPage<{ event: Event }> = ({ event }) => {
  return (
    <>
      <LyonJSHead
        title={`LyonJS | ${event.title}`}
        description={`Évènement LyonJS: ${event.shortDescription || event.description.slice(0, 250)}...`}
      />
      <main>
        <EventDetail event={event} />
        <EventMarkup event={event} />
      </main>
    </>
  );
};

const overrideEvent = (event: Event): Event => {
  if (event && dataOverride[event.eventUrl]) {
    return _merge(event, dataOverride[event.eventUrl]);
  }
  return event;
};
export const getStaticPaths: GetStaticPaths = async () => {
  const { pastEvents } = await fetchMeetupEvents();

  return {
    paths: pastEvents.map((event) => ({ params: { event: event.id } })),
    fallback: false,
  };
};

interface Params extends ParsedUrlQuery {
  event: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { pastEvents } = await fetchMeetupEvents();
  const { event } = context.params as Params;

  return {
    props: {
      event: pastEvents.find((e) => e.id === event),
    },
  };
};

export default EventPage;
