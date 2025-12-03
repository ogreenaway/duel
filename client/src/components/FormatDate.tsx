interface FormatDateProps {
  date: string | null;
}

const FormatDate = ({ date }: FormatDateProps) => {
  if (!date) {
    return null;
  }

  try {
    const dateObj = new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return <>{dateObj.toLocaleString("en-US", options)}</>;
  } catch (error) {
    // If date parsing fails, return null
    return null;
  }
};

export default FormatDate;
