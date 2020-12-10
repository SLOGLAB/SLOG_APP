import React, { useEffect } from "react";
import styled from "styled-components";
import Bookmark from "./TimeTableMenu/Bookmark";
import { SUBJECT_NAME } from "../../screens/Tabs/QueryBox";

import { useQuery } from "@apollo/react-hooks";
import Loader from "../../components/Loader";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default BookmarkSubject = ({ navigation }) => {
  const { loading, data: subjectList, refetch } = useQuery(SUBJECT_NAME, {});
  const goback = () => {
    navigation.navigate("Timecontrol");
  };
  useEffect(() => {
    refetch();
  }, []);
  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <Bookmark
          subjectList={subjectList.mySubject}
          goback={goback}
          refetch={refetch}
        />
      )}
    </View>
  );
};
