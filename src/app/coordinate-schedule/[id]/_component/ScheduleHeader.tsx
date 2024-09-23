import dayjs from 'dayjs';

const ScheduleHeader = ({ schedule }: { schedule: any }) => {
  const formattedMonth = schedule?.month ? dayjs(schedule.month).format('M') + '월' : '';

  return (
    <div className="text-center">
      <h1 className="text-[22px] md:text-[32px] font-semibold text-textMain font-gangwonEdu tracking-[0.35em] mb-8 md:mb-12">
        {formattedMonth} | {schedule?.plan_name}
      </h1>
    </div>
  );
};

export default ScheduleHeader;
