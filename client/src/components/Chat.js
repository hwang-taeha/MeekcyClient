import React from 'react';
import styled from 'styled-components';
import { Popover, Avatar } from 'antd';
import 'antd/dist/antd.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
const Chat = styled.div`
	height: 100vh;
	display: flex;
	flex-direction: column;
	padding: 14px 18.5px;
	padding-left: 10px;
	padding-right: 10px;
`;
const ChatHeader = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;
const ChatHeaderLink = styled.button`
	border: none;
	background-position: center center;

	height: 32px;
	width: 32px;
`;
const ChatHeaderTitle = styled.span`
	flex: 1;
`;
const ChatHeaderProfile = styled(Popover)``;
const ChatHeaderProfileButton = styled(Avatar)`
	height: 38px;
	width: 38px;
`;
const ChatChatpg = styled.div`
	flex: 1;
	overflow: scroll;
`;
const ChatChatpgMessage = styled.div`
	display: flex;
	align-items: center;
	padding-left: 10px;
`;
const MessageProfile = styled(Avatar)`
	width: 52px;
	height: 47px;
`;
const MessageText = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding-left: 5px;
`;
const MessageTextName = styled.div``;
const MessageTextExplain = styled.div``;
const ChatForm = styled.form``;
const ChatFormInput = styled.input`
	border-left-width: 0;
	border-right-width: 0;
	border-top-width: 0;
	border-bottom-width: 1;
	background-color: rgba(20, 20, 20, 1);
	font-size: 15px;
	border-bottom: 1.2px solid;
	width: 100vw;

	&:focus {
		outline: none;
	}
`;

const Chatting = ({
	sendMessageEnterEvent,
	chatList,
	handleChange,
	popoverAvatarClickEvent,
	avatars,
	copyLinkClickEvent,
	changeAvartarClickEvent,
	myinfo,
	chatPg,
	chatInput,
	participats,
}) => {
	return (
		<Chat>
			<ChatHeader>
				<ChatHeaderTitle>Meekcy Party 참여자 수 : {participats}</ChatHeaderTitle>
				<FontAwesomeIcon icon={faPaperclip} size={'1x'} onClick={copyLinkClickEvent} />
				<ChatHeaderProfile
					content={avatars.map((value, index) => {
						return (
							<Avatar
								key={index}
								size="32"
								id={value.id}
								src={value.url}
								onClick={changeAvartarClickEvent}
							></Avatar>
						);
					})}
					placement="left"
					title="Avatar"
					trigger="click"
				>
					<ChatHeaderProfileButton
						size="100"
						src="https://meekcy2.s3.ap-northeast-2.amazonaws.com/avatar/1.jpg"
						type="primary"
						onClick={popoverAvatarClickEvent}
					></ChatHeaderProfileButton>
				</ChatHeaderProfile>
			</ChatHeader>
			<ChatChatpg id="chatpg" ref={chatPg}>
				{chatList.map(({ value }, index) => {
					return (
						<ChatChatpgMessage key={index}>
							<MessageProfile src={value.avatar}></MessageProfile>
							<MessageText>
								<MessageTextName></MessageTextName>
								<MessageTextExplain>
									{value.message ? value.message : value.caption}
								</MessageTextExplain>
							</MessageText>
						</ChatChatpgMessage>
					);
				})}
			</ChatChatpg>
			<ChatForm onSubmit={sendMessageEnterEvent} autoComplete="off">
				<ChatFormInput
					id="chatInput"
					onChange={handleChange}
					placeholder="Type messages..."
					autoComplete="off"
					ref={chatInput}
				></ChatFormInput>
			</ChatForm>
		</Chat>
	);
};

export default Chatting;
