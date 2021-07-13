import Head from "next/head"
import Header from "../components/Header"
import Button from "@material-tailwind/react/Button"
import Icon from "@material-tailwind/react/Icon"
import Image from "next/image"
import { useSession, getSession } from "next-auth/client"
import Login from "../components/Login"
import Modal from "@material-tailwind/react/Modal"
import ModalBody from "@material-tailwind/react/ModalBody"
import ModalFooter from "@material-tailwind/react/ModalFooter"
import { useState } from "react"
import { db } from "../firebase"
import firebase from "firebase"
import { useCollectionOnce } from "react-firebase-hooks/firestore"
import DocumentRow from "../components/DocumentRow"

export default function Home() {
	const [session] = useSession()
	if (!session) {
		return <Login />
	}

	const [snapshot] = useCollectionOnce(
		db
			.collection("userDocs")
			.doc(session.user.email)
			.collection("docs")
			.orderBy("timeStamp", "desc")
	)
	const [showModal, setShowModal] = useState(false)
	const [input, setInput] = useState("")

	const createDocument = () => {
		if (!input) return
		db.collection("userDocs").doc(session.user.email).collection("docs").add({
			fileName: input,
			timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
		})
		setInput("")
		setShowModal(false)
	}

	const modal = (
		<Modal size='sm' active={showModal} toggler={() => setShowModal(false)}>
			<ModalBody>
				<input
					type='text'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className='outline-none w-full'
					placeholder='Enter the name of the document'
					onKeyDown={(e) => e.key === "Enter" && createDocument()}
				/>
			</ModalBody>
			<ModalFooter>
				<Button
					color='blue'
					buttonType='link'
					onClick={() => setShowModal(false)}
					ripple='dark'
				>
					Cancel
				</Button>
				<Button color='blue' onClick={createDocument} ripple='light'>
					Create
				</Button>
			</ModalFooter>
		</Modal>
	)

	return (
		<div className=''>
			<Head>
				<title>Google Docs clone</title>
				<link
					rel='icon'
					href='https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png'
				/>
			</Head>
			<Header />
			{modal}
			<section className='bg-[#f8f9fa pb-10 px-10 '>
				<div className='max-w-3xl mx-auto'>
					<div className='flex justify-between items-center py-6 '>
						<h2 className='text-gray-700 text-lg'>Start a new document</h2>
						<Button
							color='gray'
							buttonType='outline'
							iconOnly={true}
							ripple='dark'
							className=' border-0'
						>
							<Icon name='more_vert' size='3xl' />
						</Button>
					</div>
					<div className=''>
						<div
							onClick={() => setShowModal(true)}
							className='relative h-52 w-40 border-2 cursor-pointer hover:border-blue-500'
						>
							<Image
								src='https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png'
								layout='fill'
							/>
						</div>
						<p className='ml-2 mt-2 font-semibold text-sm text-gray-700'>
							Blank
						</p>
					</div>
				</div>
			</section>

			<section className='bg-white px-10 md:px-0  '>
				<div className='max-w-3xl mx-auto py-8 text-sm text-gray-700'>
					<div className='flex items-center justify-between pb-5'>
						<h2 className='font-medium flex-grow'>My Documents</h2>
						<p className='mr-12'>Date created</p>
						<Icon name='folder' size='3xl' color='gray' />
					</div>

					{snapshot?.docs.map((doc) => (
						<DocumentRow
							key={doc.id}
							id={doc.id}
							fileName={doc.data().fileName}
							date={doc.data().timeStamp}
						/>
					))}
				</div>
			</section>
		</div>
	)
}

export async function getServerSideProps(context) {
	const session = await getSession(context)
	return {
		props: {
			session,
		},
	}
}
