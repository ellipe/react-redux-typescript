import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { prefixZero } from '../../lib/utils';
import { RootState } from '../../redux/store';
import {
  loadUserEvents,
  selectUserEvents,
  UserEvent,
} from '../../redux/user-events';
import './Calendar.css';

const mapState = (state: RootState) => ({
  events: selectUserEvents(state),
});

const mapToDispatch = {
  loadUserEvents,
};

const connector = connect(mapState, mapToDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  return `${year}-${prefixZero(month)}-${prefixZero(day)}`;
};

const groupEventsByDay = (events: UserEvent[]) => {
  const groups: Record<string, UserEvent[]> = {};

  const addToGroup = (dateKey: string, event: UserEvent) => {
    if (groups[dateKey] === undefined) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(event);
  };

  events.forEach((event) => {
    const dateStartKey = createDateKey(new Date(event.dateStart));
    const dateEndKey = createDateKey(new Date(event.dateEnd));

    addToGroup(dateStartKey, event);

    if (dateStartKey !== dateEndKey) {
      addToGroup(dateEndKey, event);
    }
  });

  return groups;
};

const Calendar: React.FC<Props> = ({ events, loadUserEvents }: Props) => {
  useEffect(() => {
    loadUserEvents();
  }, [loadUserEvents]);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date1) - +new Date(date2)
    );
  }

  return groupedEvents && sortedGroupKeys ? (
    <div className="calendar">
      {sortedGroupKeys.map((dateKey) => {
        const events = groupedEvents && groupedEvents[dateKey];
        const groupDate = new Date(dateKey);
        const day = groupDate.getDate();
        const month = groupDate.toLocaleString(undefined, { month: 'long' });

        return (
          <div className="calendar-day" key={dateKey}>
            <div className="calendar-day-label">
              <span>
                {day} {month}
              </span>
            </div>
            <div className="calendar-events">
              {events?.map((event) => (
                <div className="calendar-event" key={event.id}>
                  <div className="calendar-event-info">
                    <div className="calendar-event-time">
                      {new Date(event.dateStart).toLocaleTimeString()} -{' '}
                      {new Date(event.dateEnd).toLocaleTimeString()}
                    </div>
                    <div className="calendar-event-title">{event.title}</div>
                  </div>
                  <button className="calendar-event-delete-button">
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default connector(Calendar);
