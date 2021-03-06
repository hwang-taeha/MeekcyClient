import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled, { css } from 'styled-components';
import Video from '../components/Video';
import Loading from '../components/Loading';
import Chat from '../containers/chattingContainer';
import { useHistory } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faComments } from '@fortawesome/free-solid-svg-icons';
import { faComments as faCommentsRegular } from '@fortawesome/free-regular-svg-icons';
import { faComments as faCommentsSolid } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import videojs from 'video.js';
import { useSelector } from 'react-redux';
library.add(faComments, faCommentsRegular, faCommentsSolid);

const Container = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;

	@media (max-width: 375px) {
		display: grid;
	}

	@media (min-width: 376px) and (max-width: 667px) {
		display: flex;
	}

	@media (min-width: 668px) and (max-width: 960px) {
		display: grid;
	}
`;

const VideoWrap = styled.div`
	width: 80%;
	height: 100vh;
	position: relative;

	${(props) => {
		if (props.ChatToggleState) {
			return css`
				width: 80%;
				transition: width 0.3s;
			`;
		} else {
			return css`
				width: 100%;
				transition: width 0.3s;
			`;
		}
	}}

	@media (max-width: 375px) {
		width: 100%;
		height: 65vh;
		${(props) => {
			if (props.ChatToggleState) {
				return css`
					height: 65vh;
					transition: height 0.3s;
				`;
			} else {
				return css`
					height: 100vh;
					transition: height 0.3s;
				`;
			}
		}}
	}

	@media (min-width: 376px) and (max-width: 667px) {
		width: 80%;
		height: 100vh;
		${(props) => {
			if (props.ChatToggleState) {
				return css`
					height: 100vh;
					transition: height 0.3s;
				`;
			} else {
				return css`
					width: 100%;
					height: 100vh;
					transition: height 0.3s;
				`;
			}
		}}
	}

	@media (min-width: 668px) and (max-width: 960px) {
		width: 100%;
		height: 65vh;
		${(props) => {
			if (props.ChatToggleState) {
				return css`
					height: 65vh;
					transition: height 0.3s;
				`;
			} else {
				return css`
					height: 100vh;
					transition: height 0.3s;
				`;
			}
		}}
	}
`;

const ChatWrqp = styled.div`
	width: 20%;
	height: 100vh;
	font-size: 20px;
	background-color: red;

	${(props) => {
		if (props.ChatToggleState) {
			return css`
				display: block;
			`;
		} else {
			return css`
				display: none;
			`;
		}
	}}

	@media (max-width: 375px) {
		width: 100%;
		height: 35vh;
	}

	@media (min-width: 376px) and (max-width: 667px) {
		width: 20%;
		height: 100vh;
	}

	@media (min-width: 668px) and (max-width: 960px) {
		width: 100%;
		height: 35vh;
	}
`;

const VideoIcon = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	display: flex;
	justify-content: space-between;
	line-height: 6;
	z-index: 2;
`;

const BackBtn = styled.div`
	padding: 5px;
	padding-left: 25px;
	cursor: pointer;
`;

const ChatToggle = styled.div`
	padding: 5px;
	padding-right: 20px;
	cursor: pointer;
`;

const token = localStorage.getItem('token');

const StreamingPage = () => {
	const [videoUrl, setVideoUrl] = useState(null);
	const [chatState, setChatState] = useState(true);
	const history = useHistory();
	const [socketIo, setSocketIO] = useState();
	const videoPlayerRef = useRef(null);
	const storeState = useSelector((state) => state.changeDetaildata, []);

	const goToBack = async () => {
		history.push(`/`);
		//history.go(0);
		socketIo.disconnect();
		const player = videojs(videoPlayerRef.current);
		const currentTime = player.currentTime();
		console.log(currentTime);
		await axios.post(
			'http://localhost:4000/videoHistory',
			{
				video_id: storeState.id,
				endTime: currentTime,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
	};
	const roomName = history.location.pathname.substring(7);

	useEffect(() => {
		let socketIO = io.connect('http://localhost:4000', {
			query: 'token=' + token,
		});

		setSocketIO(socketIO);
		socketIO.on('overlapUser', (value) => {
			console.log('this is ....', value);
			history.push(`/warn`);
			history.go(0);
			//socket.disconnect();
		});
	}, []);
	useEffect(() => {
		axios
			.get(`http://localhost:4000/rooms/${roomName}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((res) => setVideoUrl(res.data))

			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		let LoginChecking = localStorage.getItem('token');
		if (!LoginChecking) {
			history.push(`/`);
			//history.go(0);
		}
	}, []);

	useEffect(() => {});

	return (
		<Container>
			{videoUrl ? (
				<>
					<VideoWrap ChatToggleState={chatState}>
						<VideoIcon>
							<BackBtn
								onClick={() => {
									goToBack();
								}}
							>
								<FontAwesomeIcon icon={faArrowLeft} size={'2x'} />
							</BackBtn>
							<ChatToggle
								onClick={() => {
									setChatState(!chatState);
								}}
							>
								{chatState ? (
									<FontAwesomeIcon icon={['fas', 'comments']} size={'2x'} />
								) : (
									<FontAwesomeIcon icon={['far', 'comments']} size={'2x'} />
								)}
							</ChatToggle>
						</VideoIcon>
						<Video videoUrl={videoUrl} videoPlayerRef={videoPlayerRef}></Video>
					</VideoWrap>

					<ChatWrqp ChatToggleState={chatState}>
						<Chat socket={socketIo}></Chat>
					</ChatWrqp>
				</>
			) : (
				<Loading></Loading>
			)}
		</Container>
	);
};

export default StreamingPage;
