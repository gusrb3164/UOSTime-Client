import { useRecoilValue, useSetRecoilState } from 'recoil';
import React, { useRef, useState } from 'react';
import { Box, Button, Container, makeStyles, TextField, Typography } from '@material-ui/core';
import { semesterState } from '@states/Semester';
import { highLightState } from '@states/TimeTable';
import { requestAPI, API_GET_ALL_LECTURES } from '@utils/api';
import lectureToTime from '@utils/lectureToTime';
import { StatusCodes } from 'http-status-codes';

const searchOption = {
    sub_dept: '학과/학부',
    subject_div: '과목구분',
    subject_div2: '세부과목',
    subject_no: '과목번호',
    subject_nm: '과목명',
    shyr: '학년',
    credit: '학점',
    prof_nm: '교수명'
}
const scrollSize = 50;

export default function LectureList() {
    const semester = useRecoilValue(semesterState);
    const setHighlight = useSetRecoilState(highLightState);

    const [ lectureList, setLectureList ] = useState([]);
    const [ input, setInput ] = useState({searchType: 'subject_nm', keyword: ''});
    const [ selected, setSelected ] = useState(null);

    const lectureListComponent = useRef();
    const searchBtn = useRef();
    const allLectures = useRef([]);

    const classes = useStyles();

    const onMouseEnter = (e) => {
        const idx = parseInt(e.target.getAttribute('name'));
        const lecture = lectureList[idx];

        const highlight = lectureToTime(lecture);
        setHighlight(highlight);
    };

    const onMouseLeave = () => {
        setHighlight([]);
    };

    const onDetail = ({target}) => {
        const idx = parseInt(target.getAttribute('name'));

        if(selected === idx)
            setSelected(null);
        else
            setSelected(idx);
    }

    const onSearch = async () => {
        const query = {
            year: 2021,
            term: 'A10'
            // year: semester.year,
            // term: semester.term
        }
        if(input.keyword) {
            query.searchType = input.searchType;
            query.keyword = input.keyword;
        }
        const response = await requestAPI(API_GET_ALL_LECTURES().setQuery(query));

        if(!response) {
            alert('검색 도중 문제가 발생했어요.');
        }
        if(response.status === StatusCodes.OK) {
            allLectures.current = response.data;

            setLectureList(allLectures.current.slice(0, scrollSize));
        } else {
            alert(response.data);
        }
    };

    const handleScroll = (e) => {
        const scrollY = lectureListComponent.current.scrollHeight;
        const scrollTop = lectureListComponent.current.scrollTop;
        const clientHeight = lectureListComponent.current.clientHeight;

        if (scrollTop + clientHeight >= scrollY-200) {
            const currentLength = lectureList.length;
            setLectureList(lectureList.concat(allLectures.current.slice(currentLength, currentLength+scrollSize)));
        }
    };
    
    const onEnter = (e) => {
        if (e.key === 'Enter') {
            searchBtn.current.click();
        };
        
    }

    const onChange = (e) => {
        const {name, value} = e.target;

        setInput({
            ...input,
            [name]: value
        });
    }
    
    return (
        <Container>
            <select name='searchType' onChange={onChange} value={input.searchType}>
                {Object.entries(searchOption).map(([code, name], idx) => <option key={idx} value={code}>{name}</option>)}
            </select>
            <TextField name='keyword' onKeyPress={onEnter} onChange={onChange} value={input.keyword}></TextField>
            <Button onClick={onSearch} ref={searchBtn}>검색</Button>
            <Container className={classes.lectureList} onScroll={handleScroll} ref={lectureListComponent}>
                { 
                    lectureList.map((lecture, idx) => 
                        <LectureRecord 
                            key={idx} 
                            name={idx} 
                            selected={selected===idx} 
                            onClick={onDetail} 
                            onMouseEnter={onMouseEnter} 
                            onMouseLeave={onMouseLeave} 
                            lecture={lecture} 
                        />)
                }
            </Container>
        </Container>
    )
}

function LectureRecord({name, lecture, onMouseEnter, onMouseLeave, onClick, selected}) {
    const classes = useLectureRecordStyles();

    return (
        <Container name={name} className={classes.root} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <Container className={classes.simple} onClick={onClick}>
                <Box name={name}>{lecture.sub_dept}</Box>
                <Box name={name}>{lecture.subject_nm}</Box>
                <Box name={name}>{lecture.class_div}</Box>
                <Box name={name}>{lecture.subject_div}</Box>
                <Box name={name}>{lecture.shyr}</Box>
                <Box name={name}>{lecture.credit}</Box>
                <Box name={name}>{lecture.prof_nm}</Box>
                <Box name={name}>{lecture.tlsn_limit_count}</Box>
            </Container>
            {
                selected ?
                <Container className={classes.detail}>
                    <Box>
                        <Typography>강의시간 및 강의실</Typography>
                        <Typography>{lecture.class_nm}</Typography>
                    </Box>
                    <Box>
                        <Typography>수강정원</Typography>
                        <Typography>{lecture.tlsn_limit_count}</Typography>
                    </Box>
                    <Box>
                        <Typography>타과허용/복수전공</Typography>
                        <Typography>{lecture.etc_permit_yn}/{lecture.sec_permit_yn}</Typography>
                    </Box>
                </Container>
                : null
            }
        </Container>
    )
}

const useLectureRecordStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    simple: {
        display: 'flex'
    },
    detail: {
        display: 'flex'
    }
})

const useStyles = makeStyles({
    lectureList: {
        height: '500px',
        overflow: 'auto',
    }
})