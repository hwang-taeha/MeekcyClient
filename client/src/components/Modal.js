import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Detail from './Detail';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { moviesApi } from '../containers/moviesApi';

const TrueContainer = styled.div`
	display: block;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background-color: rgb(0, 0, 0);
	background-color: rgba(0, 0, 0, 0.4);
`;
const FalseContainer = styled.div`
	display: none;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgb(0, 0, 0);
	background-color: rgba(0, 0, 0, 0.4);
`;
const ModalContent = styled.div`
	background-image: url(${(props) => props.bgUrl});
	float: left;
	background-size: cover;
	border-radius: 4px;
	background-position: center center;
	transition: opacity 0.1s linear;
	position: relative;
	margin: 10% auto;
	width: 100%;
	height: 60vh;
	min-height: 450px;
`;

const BGIMG = styled.div`
	padding: 20px;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.8);
`;

const PlayBtn = styled.button`
	width: 130px;
	height: 40px;
	border-radius: 5px;
	padding: 10px 25px;
	background: transparent;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5), 7px 7px 20px 0px rgba(0, 0, 0, 0.1),
		4px 4px 5px 0px rgba(0, 0, 0, 0.1);
	border: none;
	color: black;
	background-color: white;
	cursor: pointer;
	font-size: 15px;
	position: absolute;
	bottom: 30px;
	left: 20px;
	&:hover {
		background-color: #900c3f;
		color: white;
	}
`;

const PreviewBtn = styled.button`
	width: 130px;
	height: 40px;
	border-radius: 5px;
	padding: 10px 25px;
	background: transparent;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5), 7px 7px 20px 0px rgba(0, 0, 0, 0.1),
		4px 4px 5px 0px rgba(0, 0, 0, 0.1);
	border: none;
	color: white;
	background-color: gray;
	cursor: pointer;
	font-size: 15px;
	position: absolute;
	bottom: 30px;
	left: 170px;
	&:hover {
		background-color: #900c3f;
		color: white;
	}
`;

const NewModal = ({ changeModalFalse }) => {
	const storeState = useSelector((state) => state.changeDetaildata, []);
	const history = useHistory();

	const createRoom = () => {
		let token = localStorage.getItem('token');

		axios
			.post(
				'http://localhost:4000/rooms',
				{
					video_id: storeState.id,
					end_time: 0,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				},
			)
			.then((res) => {
				history.push(`/rooms/${res.data.roomname}`);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const playButton = () => {
		changeModalFalse();
		createRoom();
	};

	const modalState = useSelector((state) => state.changeModalStatus, []);

	// themoviedb api 영상불러오기

	return (
		<>
			{modalState === true ? (
				<TrueContainer>
					<ModalContent bgUrl={storeState.poster}>
						<BGIMG>
							<Detail changeModalFalse={changeModalFalse}></Detail>

							<PlayBtn onClick={() => playButton()}>
								<FontAwesomeIcon icon={faPlay} />
								{`  PLAY`}
							</PlayBtn>
							<PreviewBtn>예고편</PreviewBtn>
						</BGIMG>
					</ModalContent>
				</TrueContainer>
			) : (
				<FalseContainer>
					<ModalContent></ModalContent>
				</FalseContainer>
			)}
		</>
	);
};
export default NewModal;
