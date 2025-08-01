--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: MediaType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MediaType" AS ENUM (
    'IMAGE',
    'YOUTUBE',
    'VIDEO'
);


--
-- Name: PostStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PostStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'PROPOSED',
    'APPROVED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: ReactionType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReactionType" AS ENUM (
    'LIKE',
    'HEART',
    'HAHA',
    'SAD',
    'ANGRY',
    'SHARE',
    'WOW'
);


--
-- Name: RoleName; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RoleName" AS ENUM (
    'ADMIN',
    'USER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AboutContent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AboutContent" (
    id text NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    description text NOT NULL,
    "youtubeUrl" text NOT NULL,
    "buttonText" text NOT NULL,
    "buttonUrl" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "userId" text,
    content text NOT NULL,
    "parentCommentId" text,
    "isApproved" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Media" (
    id text NOT NULL,
    url text NOT NULL,
    type public."MediaType" NOT NULL,
    "uploadedBy" text,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "postId" text,
    "mediaId" text
);


--
-- Name: Member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Member" (
    id text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    description text NOT NULL,
    image text NOT NULL,
    email text,
    color text DEFAULT 'blue'::text,
    skills text[] DEFAULT ARRAY[]::text[],
    "isActive" boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tabId" text
);


--
-- Name: Post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Post" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    status public."PostStatus" DEFAULT 'DRAFT'::public."PostStatus" NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    comments integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    shares integer DEFAULT 0 NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    "githubRepo" text
);


--
-- Name: PostTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PostTag" (
    "postId" text NOT NULL,
    "tagId" text NOT NULL
);


--
-- Name: Project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    href text,
    year integer NOT NULL,
    quarterly text NOT NULL,
    fund text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."ProjectStatus" DEFAULT 'PROPOSED'::public."ProjectStatus" NOT NULL
);


--
-- Name: Reaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Reaction" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "postId" text,
    type public."ReactionType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name public."RoleName" NOT NULL,
    description text
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "accessTime" timestamp(3) without time zone,
    "lastAccess" timestamp(3) without time zone
);


--
-- Name: Tab; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tab" (
    id text NOT NULL,
    name text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Technology; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Technology" (
    id text NOT NULL,
    title text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    href text NOT NULL,
    image text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "githubRepo" text
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    wallet text,
    email text,
    name text,
    image text,
    provider text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "roleId" text NOT NULL
);


--
-- Name: VideoSection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VideoSection" (
    id text NOT NULL,
    "videoId" text NOT NULL,
    "channelName" text NOT NULL,
    "videoUrl" text NOT NULL,
    title text NOT NULL,
    "thumbnailUrl" text NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: AboutContent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AboutContent" (id, title, subtitle, description, "youtubeUrl", "buttonText", "buttonUrl", "isActive", "createdAt", "updatedAt") FROM stdin;
6a056943-5a55-427f-9dd5-242054295283	About Cardano2vn	Open source dynamic assets (Token/NFT) generator (CIP68)	Cardano Vietnam (C2VN) is the official open-source hub and gathering place for Cardano enthusiasts, developers, and learners in Vietnam. We are dedicated to building a vibrant, supportive, and innovative Cardano ecosystem for the Vietnamese community.	https://www.youtube.com/embed/_GrbIRoT3mU	Learn More Cardano2vn	https://cips.cardano.org/cip/CIP-68	f	2025-07-28 07:06:17.813	2025-07-28 23:41:07.465
0f10a260-e5df-4940-9046-8b51060d3ce5	About Cardano2vn	Open source dynamic assets (Token/NFT) generator (CIP68)	Cardano Vietnam (C2VN) is the official open-source hub and gathering place for Cardano enthusiasts, developers, and learners in Vietnam. We are dedicated to building a vibrant, supportive, and innovative Cardano ecosystem for the Vietnamese community.	https://www.youtube.com/watch?v=ldE2ZivTS4g	Learn More Cardano2vn	https://cips.cardano.org/cip/CIP-68	f	2025-07-28 23:41:07.527	2025-07-28 23:43:59.732
35f7caf3-dcc1-4eef-b11d-2b54b3b0dc9d	About Cardano2vn	Open source dynamic assets (Token/NFT) generator (CIP68)	Cardano Vietnam (C2VN) is the official open-source hub and gathering place for Cardano enthusiasts, developers, and learners in Vietnam. We are dedicated to building a vibrant, supportive, and innovative Cardano ecosystem for the Vietnamese community.	https://www.youtube.com/embed/d054uh8HCrs	Learn More Cardano2vn	https://cips.cardano.org/cip/CIP-68	t	2025-07-28 23:44:00.715	2025-07-28 23:44:00.715
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comment" (id, "postId", "userId", content, "parentCommentId", "isApproved", "createdAt") FROM stdin;
eb167a37-30ff-4eac-af71-4f6b53bc9e30	86d7c5c0-6fef-40f1-8c61-b9cdc4b824d8	cmdmrjgo60001lc049k8z2c2d	ok	\N	t	2025-07-28 23:37:56.407
a130816d-b029-4b65-9766-72d79d7791ba	f92ba5c9-5bef-457d-a392-55e5aac41588	cmdq3bbnh0003l404q0p3trio	Hey Cardano 2vn	\N	t	2025-07-31 03:37:50.333
b666796e-ef61-4097-a76f-71244ef7d4f5	f92ba5c9-5bef-457d-a392-55e5aac41588	cmdq3bbnh0003l404q0p3trio	😀	\N	t	2025-07-31 03:38:22.13
9aea600b-f6fb-4ea1-aa15-f17fb692a14e	55e8219d-a86d-4d15-95b8-c98b651a02b3	cmdq3d62j0007l404ytzvh7e6	abc	\N	t	2025-08-01 03:26:18.265
\.


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Media" (id, url, type, "uploadedBy", "uploadedAt", "postId", "mediaId") FROM stdin;
9ca390ba-7567-4796-b366-aaf092a038cb	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753792384/vpt1k10xay13apmiccch.avif	IMAGE	cmdmrjgo60001lc049k8z2c2d	2025-07-29 12:52:32.706	\N	\N
http://res.cloudinary.com/dvw4ba58t/image/upload/v1753745769/vkaupu3yt5ptura8zx3n.jpg	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753745769/vkaupu3yt5ptura8zx3n.jpg	IMAGE	\N	2025-07-28 23:37:36.19	86d7c5c0-6fef-40f1-8c61-b9cdc4b824d8	\N
http://res.cloudinary.com/dvw4ba58t/image/upload/v1753749738/idz97oyo6slylvoplt6y.webp	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753749738/idz97oyo6slylvoplt6y.webp	IMAGE	\N	2025-07-29 00:42:22.349	\N	\N
8880f5c1-f1f3-4fbb-ab8c-3c5d87770622	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753745769/vkaupu3yt5ptura8zx3n.jpg	IMAGE	\N	2025-07-29 00:57:07.725	\N	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753745769/vkaupu3yt5ptura8zx3n.jpg
2bec4807-f178-472f-833d-f31129e719f6	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753745769/vkaupu3yt5ptura8zx3n.jpg	IMAGE	cmdmrjgo60001lc049k8z2c2d	2025-07-29 01:23:37.561	f79fb404-c23e-4092-849b-cb2d7b5ded63	\N
6b95ecd2-25b2-4ab7-afe7-16253eb8d7d0	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753745769/vkaupu3yt5ptura8zx3n.jpg	IMAGE	\N	2025-07-29 12:24:11.344	\N	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753745769/vkaupu3yt5ptura8zx3n.jpg
92d790a8-3d8f-44f3-b1a8-b96aacc98c62	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753792384/vpt1k10xay13apmiccch.avif	IMAGE	cmdmrjgo60001lc049k8z2c2d	2025-07-29 12:33:20.634	\N	\N
4bf0eef1-8f47-43c1-a563-dbc40a1f8e28	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753932901/nie6fm7qptm4ibelstnk.png	IMAGE	cmdq3bbnh0003l404q0p3trio	2025-07-31 03:35:22.303	f92ba5c9-5bef-457d-a392-55e5aac41588	\N
ca0abc5d-69bb-499a-9d76-d41c9f19764e	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753792384/vpt1k10xay13apmiccch.avif	IMAGE	\N	2025-07-29 13:55:54.157	\N	aebc9ec9-932d-4a5b-8ae3-423b0cdca8e8
8829768b-011e-4629-bb12-47426d71704f	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753968162/kpqccy5mp7x9kfqqjeo3.png	IMAGE	\N	2025-07-31 13:26:16.21	e96656d8-8441-41fc-a50a-8d15f47018f1	d42185b7-2dd9-4b9f-919b-780fb2120f21
acc659d2-e069-4e48-b720-7be9195a45ac	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753971384/xl8xp84tbjkhl822vtpl.jpg	IMAGE	cmdmrjgo60001lc049k8z2c2d	2025-07-31 14:17:00.505	31126b0c-fb73-456f-9f37-de0c766f5264	\N
9ee70af3-a05a-4045-9e01-d303e23ccb74	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753972972/fpab76juo8oonbg5fiox.jpg	IMAGE	cmdq3d62j0007l404ytzvh7e6	2025-07-31 14:43:03.604	55e8219d-a86d-4d15-95b8-c98b651a02b3	\N
http://res.cloudinary.com/dvw4ba58t/image/upload/v1753685867/l5wyklukdaryvoyd9uhl.png	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753685867/l5wyklukdaryvoyd9uhl.png	IMAGE	\N	2025-07-28 06:58:00.936	\N	\N
http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687516/p0n97ebbwvswzipaitry.webp	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687516/p0n97ebbwvswzipaitry.webp	IMAGE	\N	2025-07-28 07:25:24.294	\N	\N
\.


--
-- Data for Name: Member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Member" (id, name, role, description, image, email, color, skills, "isActive", "order", "createdAt", "updatedAt", "tabId") FROM stdin;
456e991c-2d7a-4d96-93b3-4b18a650eb2a	Thanh Khuat Dinh	Blockchain Solution	A malware analyst and CIP 96 author, Ali's expertise spans from assembly to high-level languages, focused on Plutus smart contract development.	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687092/tgjbqekxtysg3zhf7xhl.jpg	cardano2vn@gmail.com	orange	{Blockchain,Cardano,Plutus,Haskell,"Smart Contracts"}	t	3	2025-07-28 07:11:55.669	2025-08-01 04:19:17.739	3ae5a826-2800-4e6f-993d-d6cf4b7916f9
5d80a01c-f069-4f56-a061-e736ecd8a40e	Dung Phung Tien	Blockchain Solution	A malware analyst and CIP 96 author, Ali's expertise spans from assembly to high-level languages, focused on Plutus smart contract development.	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687064/h4rmbumnrurb7tzlmax6.jpg	cardano2vn@gmail.com	pink	{Blockchain,Cardano,Plutus,Haskell,"Smart Contracts"}	t	3	2025-07-28 07:11:55.669	2025-07-28 07:17:49.928	\N
51aa7113-8881-4dee-acbf-fe493f926aae	Phan Dinh Nghia	Frontend, Backend, Blockchain Developer	Frontend, Backend, Blockchain Developer specializing in modern web technologies, blockchain integration, and scalable application architecture.	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687126/zqalf8ccya8uoutc61rn.png	nghiaphan04dev@gmail.com	cyan	{React,Next.js,TypeScript,Node.js,Blockchain}	t	8	2025-07-28 07:11:55.669	2025-07-28 07:18:55.23	\N
d829220f-cb1f-45f0-b3fe-09578f731806	Tien Nguyen Anh	Blockchain Solution	A malware analyst and CIP 96 author, Ali's expertise spans from assembly to high-level languages, focused on Plutus smart contract development.	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687026/oksofjcfk1khpr73ufyj.jpg	cardano2vn@gmail.com	blue	{Blockchain,Cardano,Plutus,Haskell,"Smart Contracts"}	t	1	2025-07-28 07:11:55.669	2025-08-01 04:19:05.278	3ae5a826-2800-4e6f-993d-d6cf4b7916f9
18895024-86ad-4d9c-8920-c95e60370ac3	Hieu Nguyen Van	Blockchain Solution	A malware analyst and CIP 96 author, Ali's expertise spans from assembly to high-level languages, focused on Plutus smart contract development.	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687043/lejhkwwxqphustvs9vhb.jpg	cardano2vn@gmail.com	green	{Blockchain,Cardano,Plutus,Haskell,"Smart Contracts"}	t	2	2025-07-28 07:11:55.669	2025-08-01 04:19:12.459	3ae5a826-2800-4e6f-993d-d6cf4b7916f9
91202a9f-9573-481c-9cba-59e3fbc25a9a	Khanh Nguyen Duy	Blockchain Solution	A malware analyst and CIP 96 author, Ali's expertise spans from assembly to high-level languages, focused on Plutus smart contract development.	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687077/hhrcgmenhar9kpwjpxqg.jpg	cardano2vn@gmail.com	blue	{Blockchain,Cardano,Plutus,Haskell,"Smart Contracts"}	t	4	2025-07-28 07:11:55.669	2025-08-01 04:19:26.314	3ae5a826-2800-4e6f-993d-d6cf4b7916f9
33107ea8-efa7-4810-82d1-9ff50a5912e2	Dao Manh Tung	Frontend, Backend, Blockchain Developer	Frontend, Backend, Blockchain Developer specializing in modern web technologies, blockchain integration, and scalable application architecture.	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753687108/hxkwjdlfxggqwct8kygd.png	daomanhtung4102003@gmail.com	purple	{React,Next.js,TypeScript,Node.js,Blockchain}	t	7	2025-07-28 07:11:55.669	2025-08-01 08:00:57.711	3ae5a826-2800-4e6f-993d-d6cf4b7916f9
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Post" (id, title, slug, content, status, "authorId", "createdAt", "updatedAt", comments, likes, shares, views, "githubRepo") FROM stdin;
86d7c5c0-6fef-40f1-8c61-b9cdc4b824d8	From Bitcoin Interoperability X Space to Nested Transactions Roundtable Talk	from-bitcoin-interoperability-x-space-to-nested-transactions-roundtable-talk	<h1>From Bitcoin Interoperability X Space to Nested Transactions Roundtable Talk</h1><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://us1.discourse-cdn.com/flex023/uploads/cardano/optimized/3X/8/4/8410db9bc246af50bb1ae1c8f2231a6db37c1740_2_1000x473.jpeg" alt="|614xauto" width="1000" height="473"><p>On July 21st, the Cardano Community YouTube and X channels hosted a new Roundtable Talk, focused on: A Follow-up to Nested Transactions.</p><p>The original discussion from December 2024 introduced Nested Transactions, what they are, how they work, and their potential impact on the Cardano ledger. That session aimed to establish a shared understanding of this complex topic. The latest talk revisited the subject, now exploring both technical and governance aspects. Key questions included:</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>Where does the readiness stack for Nested Transactions currently stand?</p></li><li class="mb-1 mx-auto"><p>What are the alternatives, and what would be lost or gained by taking a different approach?<br>…and more.</p></li></ul><p>Featured speakers:</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>Matthieu Pizenberg, Senior Software Engineer | Cardano Foundation</p></li><li class="mb-1 mx-auto"><p>Michele Harmonic | Harmonic Labs</p></li><li class="mb-1 mx-auto"><p>Alexey Kuleshevich, CIP Author &amp; Ledger Team Lead | IOG</p></li><li class="mb-1 mx-auto"><p>Samuel Leathers, Head of Product | IOG</p></li><li class="mb-1 mx-auto"><p>Raul Antonio, CTO | FluidTokens</p></li><li class="mb-1 mx-auto"><p>Dominic Algernon Wallis, Founder | <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="http://kompact.io">kompact.io</a></p></li></ul><p>The discussion offered valuable insight into both the technical path forward and governance considerations for Cardano.</p><p>Watch the full episode here:<a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.youtube.com/watch?v=p8uJ_4ydoBU">YouTube Link</a></p><p>Also worth highlighting is the Community X Space hosted on July 3rd, which addressed the growing narrative around Bitcoin and Cardano interoperability. The conversation brought together contributors from multiple projects, including FluidTokens, BitcoinOS, Tap Protocol, Sundial Protocol, and many others.</p><h1>Blockfrost Announces ‘July of Code 2025’</h1><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://us1.discourse-cdn.com/flex023/uploads/cardano/original/3X/7/e/7e6ad797d3323b86b21a8f05787b79ce8cb1d709.png" alt="Image|568xauto" width="680" height="383"><p>Blockfrost’s July of Code 2025 is now live. This is a month-long hackathon inviting devs to build open-source apps showcasing Cardano use cases on Hyperledger FireFly. You can think of examples like, DeFi orchestration, DAO portals, or real-time analytics. There’s also a College Track with both technical and creative entry options. And the most interesting part is that no prior Web3 experience is needed. Submissions close Aug 7, with winners announced at Rare Evo on August 10. Prizes total 6,000 USDM, with 3,000 USDM for first place. Full details and submission form are available at <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="http://julyofcode.dev">julyofcode.dev</a>.</p><h1>Cardano Leios Scaling Weekly Summary</h1><p>The Cardano Leios Scaling Team has released their latest weekly summary report, showcasing quite some progress in protocol development and performance testing. The team successfully demonstrated over 1,000 transactions per second using the Stracciatella variant, with more than 95% spatial efficiency and transaction lifecycles under two minutes.</p><p>Their analysis of the Linear Leios variant suggests it could reach up to 500 times the throughput of Praos. Simulation capabilities were improved, and new experiments confirmed that even small transactions can be processed efficiently under high load. <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://leios.cardano-scaling.org/news/2025/07/07/weekly-progress-summary">Read the full summary here</a>.</p><p>In addition, the Cardano Foundation published its Q2 2025 Java Ecosystem Digest, highlighting steady progress across tooling and infrastructure. Over the past quarter, more than 90 pull requests were merged and 60+ issues closed. Updates include improved Rosetta Java support, optimizations to Yaci Store for governance and rewards data, and key upgrades to Java libraries like the Cardano Client Lib and Connect with Wallet. Security, performance, and developer experience remained central themes throughout April, May, and June. <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://developers.cardano.org/blog/2025-06-30-ecosystem-tooling-digest">Read the full Digest here</a>.</p><h1>IOG: A new era of smart contract verification on Cardano</h1><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://us1.discourse-cdn.com/flex023/uploads/cardano/optimized/3X/b/1/b1ff4a79a66b9cd5cfa17b0006f4baf10a8b94ab_2_999x409.png" alt="|614xauto" width="999" height="409"><p>IOG has introduced a powerful new tool for fully automated formal verification of Cardano smart contracts, designed to dramatically lower the barrier to secure development. By leveraging Lean4 and SMT solvers like Z3, the tool can verify contracts without requiring developers to write manual proofs. It integrates directly into CI/CD pipelines and aims to detect logic flaws early with replayable counterexamples. According to Haskell developer Jann Müller, this could reduce the cost of writing secure contracts by 90%. Still in development, the tool promises scalable, contract-level verification that’s fast, affordable, and accessible to all developers. <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://iohk.io/en/blog/posts/2025/07/17/a-new-era-of-smart-contract-verification-on-cardano/">Read the full blog here</a>.</p><h1>Intersect MBO Submits All 39 Treasury Withdrawal Proposals — Special X Space Scheduled for July 23</h1><p>Intersect MBO recently submitted 39 Treasury Withdrawal proposals. It’s now up to DReps and the Interim Constitutional Committee to decide which ones will be funded. To be approved, each proposal must gain support from at least 67% of active DRep stake and 5 out of 7 iCC members. Voting is open until the end of Epoch 576 (August 17, 2025), though proposals can be ratified earlier if they meet the required thresholds at an epoch boundary.</p><p>To support informed decision-making, a Special X Space has been scheduled for Wednesday, July 23, 2025, from 17:00 to 20:00 CEST. The Space aims to bring together all 39 vendors, giving them a chance to provide a refresher on their proposals and explain how their work benefits the Cardano ecosystem. This is a great opportunity for DReps and ada holders to engage directly and ask questions before casting their vote.</p><h1>Frederik Gregaard to Host AMA on Foundation Strategy and Finance + Podcast Highlights RE-TWIN Real Estate</h1><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://us1.discourse-cdn.com/flex023/uploads/cardano/optimized/3X/1/9/1936e7f14b07e0bd610b492190498d1f039067db_2_1000x331.png" alt="|614xauto" width="1000" height="331"><p>The Cardano Foundation has announced an upcoming <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://x.com/Cardano_CF/status/1947322831705936118">X Space AMA with CEO Frederik Gregaard</a>. This session will focus on the Foundation’s strategy, the recent launch of Reeve, and key highlights from the newly published 2024 Financial Insights Report.</p><p>For those unfamiliar, Reeve is an open-source solution designed to bring financial reporting on-chain. It enables organizations to publish verifiable, tamper-proof financial data on the Cardano blockchain—helping foster transparency, reduce costs, and simplify compliance. Learn more about Reeve<a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardanofoundation.org/blog/unveiling-reeve-enterprise-reporting"> here</a>.</p><p>The 2024 Financial Insights Report outlines how the Foundation allocated $22.1 million across operational resilience, education, and adoption, along with an additional $7.1 million toward core operations. Highlights include support for decentralized governance, educational partnerships, and real-world enterprise use cases. All financial data is accessible via Reeve, further strengthening the Foundation’s commitment to transparency and long-term ecosystem sustainability. Read the full report<a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardanofoundation.org/blog/2024-financial-insights-report"> here</a>.</p><p>The Foundation also dropped a new “<a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://open.spotify.com/episode/2edYkI1m0H9AFXnx6Tz8PD">Let’s Talk Cardano</a>” episode on Spotify, featuring Tokenance’s Fulvio Magni and Francesco Pagano. They introduce RE-TWIN, a SaaS tool that uses Cardano and AI to create on-chain digital twins of real estate—complete with deeds, contracts, and tax data. The episode highlights how this tackles document loss and asset tracking, their partnership with YurekAI, and why Cardano was chosen to power this scalable solution.</p><hr><h1>Cardano Reddit Top 9 Most Engaged Topics</h1><p>Below are the most engaging topics on Reddit</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m0fr9u/cardano_foundation_reveals_659_million_treasury/">Cardano Foundation Reveals $659 Million Treasury</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m5o86e/firing_cardano_whale_as_drep_where_to_go_now/">Firing Cardano Whale as Drep. Where to go now?</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m39wh7/charles_hoskinson_reacts_as_cardano_now_available/">Charles Hoskinson Reacts as Cardano Now Available for </a><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="http://Blockchain.com">Blockchain.com</a><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m39wh7/charles_hoskinson_reacts_as_cardano_now_available/">’s 37M Users</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m1p2yz/cardano_is_now_the_1_most_bullish_crypto_in_the/">Cardano is now the #1 most bullish crypto in the world! Join Gianna as she discusses why, as well as what is happening with crypto regulation in the United States.</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m50o4k/in_your_opinion_do_you_think_cardano_ada_is_a/">In your opinion, do you think Cardano ADA is a better bitcoin?</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m2jc37/the_clarity_act_just_passed_in_the_united_states/">The Clarity Act just passed in the United States! Join Gianna as she reveals why this is bullish for Cardano and the reasoning why it stands out above other altcoins so far.</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m0ol55/wtf_is_the_clarity_act_why_cardano_is_already/">Wtf is the clarity act &amp; why cardano is already winning?!</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m0dyg4/emurgo_to_launch_a_visa_card_for_adabtcusdc_etc/">Emurgo to Launch a Visa Card for ADA/BTC/USDC etc with benefits..</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.reddit.com/r/cardano/comments/1m2yawz/cheapest_way_to_swap_btc_for_ada/">Cheapest way to swap BTC for ADA</a></p></li></ul><h1>Cardano Forum Top 9 Referred Topics</h1><p>Topics that have received the most clicks from external sources. (last 10 Days)</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/launching-catalyst-fund14-gathering-ideas-honouring-governance-and-powering-forward">Launching Catalyst Fund14: Gathering Ideas, Honouring Governance, and Powering Forward</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/delegated-is-changed-without-let-me">delegated is changed without let me</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/restore-adas-with-ledger-nano-x">Restore ADAs with Ledger Nano X</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/cdec-dreps">CDECよりDRepsの皆さまへ：分散型ガバナンスの次なる一歩に向けて</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/updates-to-cardano-node-metrics-to-prometheus">Updates to Cardano node metrics to Prometheus?</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/cardano-blockchain-towards-concrete-solutions-for-francophone-africa">Cardano Blockchain: Towards Concrete Solutions for Francophone Africa</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/cripto-noticias-cardano-card-tarjeta-para-gastar-ada-btc-sol-usdc-usdt-de-emurgo">Cripto Noticias Cardano Card: Tarjeta Para Gastar ADA BTC SOL USDC USDT de Emurgo</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/blockchain-cardano-vers-des-solutions-concretes-pour-lafrique-francophone">Blockchain Cardano : Vers des Solutions Concrètes pour l’Afrique Francophone</a></p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://forum.cardano.org/t/anzens-partners-with-shpayments-to-provide-eu-ibans-to-web3-businesses">Anzens Partners with SHPayments to Provide EU IBANs to Web3 Businesses</a></p></li></ul><hr><p>Upcoming Community Events</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>07-23 DRep Working Group - Budget Approval: Each session will focus on providing up-to-date information about the budget process. Our goal is to create a collaborative environment where DReps can engage in discussions, ask questions, and share perspectives - <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://lu.ma/w56c029n">link</a></p></li><li class="mb-1 mx-auto"><p>07-23 Filip Blagojevic: On Cardano Over Coffee: Apex Fusion brings together battle tested technology and teams from UTXO and EVM worlds in a novel tri-chain architecture to innovate for the future, together. - <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://x.com/i/spaces/1eaJbWgbjPvxX">link</a></p></li><li class="mb-1 mx-auto"><p>07-23 Let’s Talk Cardano Treasury: To mark a historic milestone in Cardano’s governance journey, this X (Twitter) Space aims to bring together all 39 Treasury Withdrawal proposers, explaining how their proposal benefits the ecosystem - <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://x.com/i/spaces/1vAxRDkOqvzGl">link</a></p></li><li class="mb-1 mx-auto"><p>07-24 Intersect OSC Meeting: The Open Source Committee meets bi-weekly on Thursdays! Join in and stay up to date with changes to Open Source in 2025 - <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://meet.google.com/eeb-qjbx-agw">link</a></p></li><li class="mb-1 mx-auto"><p>07-24 Product Committee: On Cardano Over Coffee: This is discuss the Product Comm 2030 vision roadmap and to talk about the workshops that have been done along with those that are upcoming - <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://x.com/i/spaces/1zqKVjRpazVKB">link</a></p></li><li class="mb-1 mx-auto"><p>07-24 Spidex AI : On Cardano Over Coffee: Spidex AI is a DeFAI platform built to simplify and supercharge Cardano DeFi. Powered by a network of specialized AI Agents, Spidex AI lets you interact with DeFi seamlessly without hopping between apps or complex tools - <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://x.com/i/spaces/1MYxNwoZlVPKw">link</a></p></li><li class="mb-1 mx-auto"><p>07-28 SPO Table Talk: CIP50 - Understanding the Impact of Pledge Leverage - The implications of CIP50 are significant. Not only could it reshape the current rewards scheme and affect the role of the existing pledge parameter, but its implementation would also require a hard fork. This makes it a critical topic for open, transparent community discussion. From a governance perspective, this could mark the first time SPOs are asked to weigh in on a Governance Action that introduces a new parameter at the protocol level—an important milestone for on-chain governance in Cardano - <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.youtube.com/watch?v=dGymb5wCX8Y">link</a></p></li></ul><p>For an overview of weekly events, visit the <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardanocalendar.io/calendar">Cardano Calendar</a></p><hr><p>Many thanks and greetings from the Community Team!</p>	PUBLISHED	cmdmrjgo60001lc049k8z2c2d	2025-07-28 23:37:33.781	2025-07-28 23:37:33.781	0	0	0	0	\N
f92ba5c9-5bef-457d-a392-55e5aac41588	Cardano2vn	cardano2vn	<p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardano2-vn.vercel.app/admin/posts">https://cardano2-vn.vercel.app/admin/posts</a></p>	PUBLISHED	cmdq3bbnh0003l404q0p3trio	2025-07-31 03:35:19.76	2025-07-31 03:35:19.76	0	0	0	0	\N
f79fb404-c23e-4092-849b-cb2d7b5ded63	GitHub MCP Server	github-mcp-server	<p>The GitHub MCP Server connects AI tools directly to GitHub's platform. This gives AI agents, assistants, and chatbots the ability to read repositories and code files, manage issues and PRs, analyze code, and automate workflows. All through natural language interactions.</p><h3><strong>Use Cases</strong></h3><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>Repository Management: Browse and query code, search files, analyze commits, and understand project structure across any repository you have access to.</p></li><li class="mb-1 mx-auto"><p>Issue &amp; PR Automation: Create, update, and manage issues and pull requests. Let AI help triage bugs, review code changes, and maintain project boards.</p></li><li class="mb-1 mx-auto"><p>CI/CD &amp; Workflow Intelligence: Monitor GitHub Actions workflow runs, analyze build failures, manage releases, and get insights into your development pipeline.</p></li><li class="mb-1 mx-auto"><p>Code Analysis: Examine security findings, review Dependabot alerts, understand code patterns, and get comprehensive insights into your codebase.</p></li><li class="mb-1 mx-auto"><p>Team Collaboration: Access discussions, manage notifications, analyze team activity, and streamline processes for your team.</p></li></ul><p>Built for developers who want to connect their AI tools to GitHub context and capabilities, from simple natural language queries to complex multi-step agent workflows.</p><hr><h2><strong>Remote GitHub MCP Server</strong></h2><p></p><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://camo.githubusercontent.com/1095942dd67c822e29ea2a8e70104baea63dbbcf8f3a39ce22fb5a1fd60f43a7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f56535f436f64652d496e7374616c6c5f5365727665722d3030393846463f7374796c653d666c61742d737175617265266c6f676f3d76697375616c73747564696f636f6465266c6f676f436f6c6f723d7768697465" alt="Install in VS Code"><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://camo.githubusercontent.com/12abeeb2bb50d1c3a778df1d2c822dc4d04f69b42dc4dea565ace88a7c5e057d/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f56535f436f64655f496e7369646572732d496e7374616c6c5f5365727665722d3234626661353f7374796c653d666c61742d737175617265266c6f676f3d76697375616c73747564696f636f6465266c6f676f436f6c6f723d7768697465" alt="Install in VS Code Insiders"><p>The remote GitHub MCP Server is hosted by GitHub and provides the easiest method for getting up and running. If your MCP host does not support remote MCP servers, don't worry! You can use the <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server?tab=readme-ov-file#local-github-mcp-server"><u>local version of the GitHub MCP Server</u></a> instead.</p><h3><strong>Prerequisites</strong></h3><ol class="list-decimal list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>A compatible MCP host with remote server support (VS Code 1.101+, Claude Desktop, Cursor, Windsurf, etc.)</p></li><li class="mb-1 mx-auto"><p>Any applicable <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/policies-and-governance.md"><u>policies enabled</u></a></p></li></ol><h3><strong>Install in VS Code</strong></h3><p>For quick installation, use one of the one-click install buttons above. Once you complete that flow, toggle Agent mode (located by the Copilot Chat text input) and the server will start. Make sure you're using <a target="_blank" rel="nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://code.visualstudio.com/updates/v1_101"><u>VS Code 1.101</u></a> or <a target="_blank" rel="nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://code.visualstudio.com/updates"><u>later</u></a> for remote MCP and OAuth support.</p><p>Alternatively, to manually configure VS Code, choose the appropriate JSON block from the examples below and add it to your host configuration:</p><table class="border-collapse w-full mx-auto rounded-lg overflow-hidden" style="min-width: 50px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th class="font-bold border p-2 mx-auto text-center" colspan="1" rowspan="1"><p><strong>Using OAuth</strong></p></th><th class="font-bold border p-2 mx-auto text-center" colspan="1" rowspan="1"><p><strong>Using a GitHub PAT</strong></p></th></tr><tr><th class="font-bold border p-2 mx-auto text-center" colspan="2" rowspan="1"><p><strong>VS Code (version 1.101 or greater)</strong></p></th></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">{\n  "servers": {\n    "github": {\n      "type": "http",\n      "url": "https://api.githubcopilot.com/mcp/"\n    }\n  }\n}</code></pre></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">{\n  "servers": {\n    "github": {\n      "type": "http",\n      "url": "https://api.githubcopilot.com/mcp/",\n      "headers": {\n        "Authorization": "Bearer ${input:github_mcp_pat}"\n      }\n    }\n  },\n  "inputs": [\n    {\n      "type": "promptString",\n      "id": "github_mcp_pat",\n      "description": "GitHub Personal Access Token",\n      "password": true\n    }\n  ]\n}</code></pre></td></tr></tbody></table><h3><strong>Install in other MCP hosts</strong></h3><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-other-copilot-ides.md"><strong><u>GitHub Copilot in other IDEs</u></strong></a> - Installation for JetBrains, Visual Studio, Eclipse, and Xcode with GitHub Copilot</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-claude.md"><strong><u>Claude Applications</u></strong></a> - Installation guide for Claude Web, Claude Desktop and Claude Code CLI</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md"><strong><u>Cursor</u></strong></a> - Installation guide for Cursor IDE</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-windsurf.md"><strong><u>Windsurf</u></strong></a> - Installation guide for Windsurf IDE</p></li></ul><blockquote><p><strong>Note:</strong> Each MCP host application needs to configure a GitHub App or OAuth App to support remote access via OAuth. Any host application that supports remote MCP servers should support the remote GitHub server with PAT authentication. Configuration details and support levels vary by host. Make sure to refer to the host application's documentation for more info.</p></blockquote><blockquote><p>⚠️ <strong>Public Preview Status:</strong> The <strong>remote</strong> GitHub MCP Server is currently in Public Preview. During preview, access may be gated depending on authentication type and surface:</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>OAuth: Subject to GitHub Copilot Editor Preview Policy until GA</p></li><li class="mb-1 mx-auto"><p>PAT: Controlled via your organization's PAT policies</p></li><li class="mb-1 mx-auto"><p>MCP Servers in Copilot policy: Enables/disables access to all MCP servers in VS Code, with other Copilot editors migrating to this policy in the coming months.</p></li></ul></blockquote><h3><strong>Configuration</strong></h3><p>See <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md"><u>Remote Server Documentation</u></a> on how to pass additional configuration settings to the remote GitHub MCP Server.</p><hr><h2><strong>Local GitHub MCP Server</strong></h2><p></p><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://camo.githubusercontent.com/1095942dd67c822e29ea2a8e70104baea63dbbcf8f3a39ce22fb5a1fd60f43a7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f56535f436f64652d496e7374616c6c5f5365727665722d3030393846463f7374796c653d666c61742d737175617265266c6f676f3d76697375616c73747564696f636f6465266c6f676f436f6c6f723d7768697465" alt="Install with Docker in VS Code"><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://camo.githubusercontent.com/12abeeb2bb50d1c3a778df1d2c822dc4d04f69b42dc4dea565ace88a7c5e057d/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f56535f436f64655f496e7369646572732d496e7374616c6c5f5365727665722d3234626661353f7374796c653d666c61742d737175617265266c6f676f3d76697375616c73747564696f636f6465266c6f676f436f6c6f723d7768697465" alt="Install with Docker in VS Code Insiders"><h3><strong>Prerequisites</strong></h3><ol class="list-decimal list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>To run the server in a container, you will need to have <a target="_blank" rel="nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://www.docker.com/"><u>Docker</u></a> installed.</p></li><li class="mb-1 mx-auto"><p>Once Docker is installed, you will also need to ensure Docker is running. The image is public; if you get errors on pull, you may have an expired token and need to <code>docker logout ghcr.io</code>.</p></li><li class="mb-1 mx-auto"><p>Lastly you will need to <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/settings/personal-access-tokens/new"><u>Create a GitHub Personal Access Token</u></a>. The MCP server can use many of the GitHub APIs, so enable the permissions that you feel comfortable granting your AI tools (to learn more about access tokens, please check out the <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"><u>documentation</u></a>).</p></li></ol><h2><strong>Installation</strong></h2><h3><strong>Install in GitHub Copilot on VS Code</strong></h3><p>For quick installation, use one of the one-click install buttons above. Once you complete that flow, toggle Agent mode (located by the Copilot Chat text input) and the server will start.</p><p>More about using MCP server tools in VS Code's <a target="_blank" rel="nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://code.visualstudio.com/docs/copilot/chat/mcp-servers"><u>agent mode documentation</u></a>.</p><p>Install in GitHub Copilot on other IDEs (JetBrains, Visual Studio, Eclipse, etc.)</p><p>Add the following JSON block to your IDE's MCP settings.</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">{\n  "mcp": {\n    "inputs": [\n      {\n        "type": "promptString",\n        "id": "github_token",\n        "description": "GitHub Personal Access Token",\n        "password": true\n      }\n    ],\n    "servers": {\n      "github": {\n        "command": "docker",\n        "args": [\n          "run",\n          "-i",\n          "--rm",\n          "-e",\n          "GITHUB_PERSONAL_ACCESS_TOKEN",\n          "ghcr.io/github/github-mcp-server"\n        ],\n        "env": {\n          "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"\n        }\n      }\n    }\n  }\n}</code></pre><p>Optionally, you can add a similar example (i.e. without the mcp key) to a file called <code>.vscode/mcp.json</code> in your workspace. This will allow you to share the configuration with other host applications that accept the same format.</p><h3><strong>Install in Other MCP Hosts</strong></h3><p>For other MCP host applications, please refer to our installation guides:</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-other-copilot-ides.md"><strong><u>GitHub Copilot in other IDEs</u></strong></a> - Installation for JetBrains, Visual Studio, Eclipse, and Xcode with GitHub Copilot</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-claude.md"><strong><u>Claude Code &amp; Claude Desktop</u></strong></a> - Installation guide for Claude Code and Claude Desktop</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md"><strong><u>Cursor</u></strong></a> - Installation guide for Cursor IDE</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-windsurf.md"><strong><u>Windsurf</u></strong></a> - Installation guide for Windsurf IDE</p></li></ul><p>For a complete overview of all installation options, see our <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/installation-guides.md"><strong><u>Installation Guides Index</u></strong></a>.</p><blockquote><p><strong>Note:</strong> Any host application that supports local MCP servers should be able to access the local GitHub MCP server. However, the specific configuration process, syntax and stability of the integration will vary by host application. While many may follow a similar format to the examples above, this is not guaranteed. Please refer to your host application's documentation for the correct MCP configuration syntax and setup process.</p></blockquote><h3><strong>Build from source</strong></h3><p>If you don't have Docker, you can use <code>go build</code> to build the binary in the <code>cmd/github-mcp-server</code> directory, and use the <code>github-mcp-server stdio</code> command with the <code>GITHUB_PERSONAL_ACCESS_TOKEN</code> environment variable set to your token. To specify the output location of the build, use the <code>-o</code> flag. You should configure your server to use the built executable as its <code>command</code>. For example:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">{\n  "mcp": {\n    "servers": {\n      "github": {\n        "command": "/path/to/github-mcp-server",\n        "args": ["stdio"],\n        "env": {\n          "GITHUB_PERSONAL_ACCESS_TOKEN": "&lt;YOUR_TOKEN&gt;"\n        }\n      }\n    }\n  }\n}</code></pre><h2><strong>Tool Configuration</strong></h2><p>The GitHub MCP Server supports enabling or disabling specific groups of functionalities via the <code>--toolsets</code> flag. This allows you to control which GitHub API capabilities are available to your AI tools. Enabling only the toolsets that you need can help the LLM with tool choice and reduce the context size.</p><p><em>Toolsets are not limited to Tools. Relevant MCP Resources and Prompts are also included where applicable.</em></p><h3><strong>Available Toolsets</strong></h3><p>The following sets of tools are available (all are on by default):</p><table class="border-collapse w-full mx-auto rounded-lg overflow-hidden" style="min-width: 50px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th class="font-bold border p-2 mx-auto text-center" colspan="1" rowspan="1"><p><strong>Toolset</strong></p></th><th class="font-bold border p-2 mx-auto text-center" colspan="1" rowspan="1"><p><strong>Description</strong></p></th></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>context</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><strong>Strongly recommended</strong>: Tools that provide context about the current user and GitHub context you are operating in</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>actions</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>GitHub Actions workflows and CI/CD operations</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>code_security</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>Code security related tools, such as GitHub Code Scanning</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>dependabot</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>Dependabot tools</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>discussions</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>GitHub Discussions related tools</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>experiments</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>Experimental features that are not considered stable yet</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>issues</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>GitHub Issues related tools</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>notifications</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>GitHub Notifications related tools</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>orgs</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>GitHub Organization related tools</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>pull_requests</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>GitHub Pull Request related tools</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>repos</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>GitHub Repository related tools</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>secret_protection</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>Secret protection related tools, such as GitHub Secret Scanning</p></td></tr><tr><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p><code>users</code></p></td><td class="border p-2 mx-auto" colspan="1" rowspan="1"><p>GitHub User related tools</p></td></tr></tbody></table><h4><strong>Specifying Toolsets</strong></h4><p>To specify toolsets you want available to the LLM, you can pass an allow-list in two ways:</p><ol class="list-decimal list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p><strong>Using Command Line Argument</strong>:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">github-mcp-server --toolsets repos,issues,pull_requests,actions,code_security</code></pre></li><li class="mb-1 mx-auto"><p><strong>Using Environment Variable</strong>:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">GITHUB_TOOLSETS="repos,issues,pull_requests,actions,code_security" ./github-mcp-server</code></pre></li></ol><p>The environment variable <code>GITHUB_TOOLSETS</code> takes precedence over the command line argument if both are provided.</p><h3><strong>Using Toolsets With Docker</strong></h3><p>When using Docker, you can pass the toolsets as environment variables:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">docker run -i --rm \\\n  -e GITHUB_PERSONAL_ACCESS_TOKEN=&lt;your-token&gt; \\\n  -e GITHUB_TOOLSETS="repos,issues,pull_requests,actions,code_security,experiments" \\\n  ghcr.io/github/github-mcp-server</code></pre><h3><strong>The "all" Toolset</strong></h3><p>The special toolset <code>all</code> can be provided to enable all available toolsets regardless of any other configuration:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">./github-mcp-server --toolsets all</code></pre><p>Or using the environment variable:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">GITHUB_TOOLSETS="all" ./github-mcp-server</code></pre><h2><strong>Dynamic Tool Discovery</strong></h2><p><strong>Note</strong>: This feature is currently in beta and may not be available in all environments. Please test it out and let us know if you encounter any issues.</p><p>Instead of starting with all tools enabled, you can turn on dynamic toolset discovery. Dynamic toolsets allow the MCP host to list and enable toolsets in response to a user prompt. This should help to avoid situations where the model gets confused by the sheer number of tools available.</p><h3><strong>Using Dynamic Tool Discovery</strong></h3><p>When using the binary, you can pass the <code>--dynamic-toolsets</code> flag.</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">./github-mcp-server --dynamic-toolsets</code></pre><p>When using Docker, you can pass the toolsets as environment variables:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">docker run -i --rm \\\n  -e GITHUB_PERSONAL_ACCESS_TOKEN=&lt;your-token&gt; \\\n  -e GITHUB_DYNAMIC_TOOLSETS=1 \\\n  ghcr.io/github/github-mcp-server</code></pre><h2><strong>Read-Only Mode</strong></h2><p>To run the server in read-only mode, you can use the <code>--read-only</code> flag. This will only offer read-only tools, preventing any modifications to repositories, issues, pull requests, etc.</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">./github-mcp-server --read-only</code></pre><p>When using Docker, you can pass the read-only mode as an environment variable:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">docker run -i --rm \\\n  -e GITHUB_PERSONAL_ACCESS_TOKEN=&lt;your-token&gt; \\\n  -e GITHUB_READ_ONLY=1 \\\n  ghcr.io/github/github-mcp-server</code></pre><h2><strong>GitHub Enterprise Server and Enterprise Cloud with data residency (ghe.com)</strong></h2><p>The flag <code>--gh-host</code> and the environment variable <code>GITHUB_HOST</code> can be used to set the hostname for GitHub Enterprise Server or GitHub Enterprise Cloud with data residency.</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>For GitHub Enterprise Server, prefix the hostname with the <code>https://</code> URI scheme, as it otherwise defaults to <code>http://</code>, which GitHub Enterprise Server does not support.</p></li><li class="mb-1 mx-auto"><p>For GitHub Enterprise Cloud with data residency, use <code>https://YOURSUBDOMAIN.ghe.com</code> as the hostname.</p></li></ul><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">"github": {\n    "command": "docker",\n    "args": [\n    "run",\n    "-i",\n    "--rm",\n    "-e",\n    "GITHUB_PERSONAL_ACCESS_TOKEN",\n    "-e",\n    "GITHUB_HOST",\n    "ghcr.io/github/github-mcp-server"\n    ],\n    "env": {\n        "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}",\n        "GITHUB_HOST": "https://&lt;your GHES or ghe.com domain name&gt;"\n    }\n}</code></pre><h2><strong>i18n / Overriding Descriptions</strong></h2><p>The descriptions of the tools can be overridden by creating a <code>github-mcp-server-config.json</code> file in the same directory as the binary.</p><p>The file should contain a JSON object with the tool names as keys and the new descriptions as values. For example:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">{\n  "TOOL_ADD_ISSUE_COMMENT_DESCRIPTION": "an alternative description",\n  "TOOL_CREATE_BRANCH_DESCRIPTION": "Create a new branch in a GitHub repository"\n}</code></pre><p>You can create an export of the current translations by running the binary with the <code>--export-translations</code> flag.</p><p>This flag will preserve any translations/overrides you have made, while adding any new translations that have been added to the binary since the last time you exported.</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">./github-mcp-server --export-translations\ncat github-mcp-server-config.json</code></pre><p>You can also use ENV vars to override the descriptions. The environment variable names are the same as the keys in the JSON file, prefixed with <code>GITHUB_MCP_</code> and all uppercase.</p><p>For example, to override the <code>TOOL_ADD_ISSUE_COMMENT_DESCRIPTION</code> tool, you can set the following environment variable:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">export GITHUB_MCP_TOOL_ADD_ISSUE_COMMENT_DESCRIPTION="an alternative description"</code></pre><h2><strong>Library Usage</strong></h2><p>The exported Go API of this module should currently be considered unstable, and subject to breaking changes. In the future, we may offer stability; please file an issue if there is a use case where this would be valuable.</p><h2><strong>License</strong></h2><p>This project is licensed under the terms of the MIT open source license. Please refer to <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/github/github-mcp-server/blob/main/LICENSE"><u>MIT</u></a> for the full terms.</p>	PUBLISHED	cmdmrjgo60001lc049k8z2c2d	2025-07-29 01:23:35.07	2025-07-29 01:23:35.07	0	0	0	0	\N
e96656d8-8441-41fc-a50a-8d15f47018f1	System Architecture	system-architecture	<blockquote><p>This solution is an implementation of the <a target="_blank" rel="noopener noreferrer" class="text-blue-500 underline cursor-pointer mx-auto" href="https://docs.cloud.coinbase.com/rosetta/docs/welcome"><u>Mesh API</u></a> (formerly known as Rosetta API) specification for Cardano Blockchain.</p></blockquote><p>Here and below we use <a target="_blank" rel="noopener noreferrer" class="text-blue-500 underline cursor-pointer mx-auto" href="https://en.wikipedia.org/wiki/C4_model">C4</a> notation to describe the solution architecture.</p><p></p><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://cardano-foundation.github.io/cardano-rosetta-java/assets/images/ContextDiagram.drawio-8ad497d97881e668a3002b12794f93dc.svg" alt="Context Diagram"><p style="text-align: center;"><em>Figure 1: Context Diagram showing system boundaries and external dependencies</em></p><p>The specific changes in this implementation can be found in <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardano-foundation.github.io/cardano-rosetta-java/docs/core-concepts/cardano-addons">Cardano Specific API Additions</a></p><blockquote><p><strong>Getting Started</strong></p><p>To use this Rosetta API for Cardano you can build the project from source or use the pre-built docker image.</p></blockquote><p><a target="_blank" rel="noopener noreferrer" class="text-blue-500 underline cursor-pointer mx-auto" href="https://hub.docker.com/r/cardanofoundation/cardano-rosetta-java"><u>Docker Images</u></a></p><p>The solution provides Construction API (mutation of data) and Data API (read data) according to the Rosetta spec accessible via an REST API that allows you to interact with the Cardano blockchain.</p><h2><strong>Implementation Details</strong></h2><p>The architecture consists of four essential components:</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardano-foundation.github.io/cardano-rosetta-java/docs/core-concepts/architecture#cardano-node"><strong>Cardano Node</strong></a>: The foundational layer that maintains blockchain state and connects to the Cardano network</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardano-foundation.github.io/cardano-rosetta-java/docs/core-concepts/architecture#yaci-indexer-app"><strong>Yaci Indexer App</strong></a>: Processes and transforms blockchain data into queryable database records</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardano-foundation.github.io/cardano-rosetta-java/docs/core-concepts/architecture#rosetta-api-app"><strong>Rosetta API App</strong></a>: Implements the Rosetta specification endpoints for blockchain interaction</p></li><li class="mb-1 mx-auto"><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardano-foundation.github.io/cardano-rosetta-java/docs/core-concepts/architecture#database"><strong>Database</strong></a>: Stores optimized blockchain data for efficient API access</p></li></ul><p>The Cardano Node serves as the primary source of blockchain data. The Yaci Indexer App fetches data block-by-block from the node, processes it, and stores only the necessary information in the Database, optimized for query performance.</p><p>For Data API requests, the Rosetta API App reads this indexed data directly from the Database. For Construction API requests, it uses the Cardano Node to validate and submit transactions to the Cardano network.</p><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://cardano-foundation.github.io/cardano-rosetta-java/assets/images/ComponentDiagram.drawio-cca5233e69801b51dd3e3c58ad1c0574.svg" alt="Component Diagram"><p style="text-align: center;"><em>Figure 2: Component Diagram showing internal architecture</em></p><h2><strong>Key Components</strong></h2><h3><strong>Cardano Node</strong></h3><p>The Cardano Node is a full implementation of the Cardano blockchain protocol that connects to the Cardano network, validates transactions and blocks, and maintains the blockchain state.</p><blockquote><p><strong>Version</strong>: 10.3.1 (configurable via build args)<br><strong>Built with</strong>: GHC 9.6.7 and Cabal 3.12.1.0<br><strong>Runtime socket path</strong>: <code>/node/node.socket</code><br><strong>Data directory</strong>: <code>/node/db</code><br><strong>Network options</strong>: mainnet, preprod, preview, devkit<br><strong>Configuration files</strong>: stored in <code>/config</code> directory</p></blockquote><p>The node is the foundation of the system, providing blockchain data to the indexer and validating/submitting transactions to the network.</p><h3><strong>Cardano Submit API</strong></h3><p>The Cardano Submit API provides a REST interface for submitting transactions to the Cardano network.</p><blockquote><p><strong>Port</strong>: 8090 (configurable)<br><strong>Configuration file</strong>: <code>/cardano-submit-api-config/cardano-submit-api.yaml</code><br><strong>Connects to</strong>: Cardano Node via its socket<br><strong>Functionality</strong>: Exposes HTTP endpoints for transaction submission<br><strong>Startup</strong>: Started by the entrypoint script after node initialization</p></blockquote><p>This component provides a standard interface for transaction submission, allowing the Rosetta API to submit user transactions to the Cardano network.</p><h3><strong>Yaci Indexer App</strong></h3><p>The YACI (Yet Another Cardano Indexer) Indexer processes blockchain data from the Cardano Node and stores it in a structured format in the PostgreSQL database.</p><blockquote><p><strong>Base library</strong>: yaci version 0.3.5<br><strong>API port</strong>: 9095</p></blockquote><p>The indexer features modular components that support different aspects of the Cardano blockchain, including blocks, transactions, UTXOs, staking, and epoch data. It handles efficient data processing with configurable pruning options to manage database size.</p><h3><strong>Database</strong></h3><p>PostgreSQL database stores indexed blockchain data in a structured format optimized for API queries. While YACI store supports multiple database options, PostgreSQL is the default and recommended choice for this implementation.</p><blockquote><p><strong>Version</strong>: 14 (configurable)<br><strong>Schema name</strong>: Based on network (e.g., mainnet, preprod)<br><strong>Default credentials</strong>: Username: rosetta_db_admin, Password: configurable<br><strong>Data directory</strong>: <code>/var/lib/postgresql/data</code> (mapped to <code>${DB_PATH}</code> on the host)</p></blockquote><p>Configurable performance parameters through <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline cursor-pointer mx-auto" href="https://cardano-foundation.github.io/cardano-rosetta-java/docs/install-and-deploy/hardware-profiles">hardware profiles</a>.</p><h3><strong>Rosetta API App</strong></h3><p>The Rosetta API implements the Mesh (formerly Rosetta) API specification, providing a standardized interface for blockchain interaction. This application handles <a target="_blank" rel="noopener noreferrer" class="text-blue-500 underline cursor-pointer mx-auto" href="https://docs.cloud.coinbase.com/rosetta/docs/data-api-overview">Data API</a> requests by reading aggregated data from the database, and manages <a target="_blank" rel="noopener noreferrer" class="text-blue-500 underline cursor-pointer mx-auto" href="https://docs.cloud.coinbase.com/rosetta/docs/construction-api-overview">Construction API</a> requests by constructing and submitting transactions to the Cardano Node using the <a target="_blank" rel="noopener noreferrer" class="text-blue-500 underline cursor-pointer mx-auto" href="https://github.com/bloxbean/cardano-client-lib">cardano-client-lib</a>.</p><blockquote><p><strong>Implements</strong>: Rosetta API version 1.4.13<br><strong>Built with</strong>: Spring Boot 3.2.3<br><strong>Port</strong>: 8082<br><strong>Java version</strong>: 21<br><strong>Operation modes</strong>: Online (with node connection), Offline (transaction construction only)</p></blockquote><p style="text-align: right;"><em>Last updated on </em><strong><em>Jul 31, 2025</em></strong><em> by </em><strong><em>Nguyen Anh Tien</em></strong></p>	PUBLISHED	cmdq3d62j0007l404ytzvh7e6	2025-07-31 13:26:07.652	2025-07-31 13:26:16.279	0	0	0	0	\N
31126b0c-fb73-456f-9f37-de0c766f5264	Cardano API Additions	cardano-api-additions	<p>Although <code>Cardano Rosetta Java</code> is compliant with <a target="_blank" rel="noopener noreferrer" class="text-blue-500 underline cursor-pointer mx-auto" href="https://docs.cloud.coinbase.com/rosetta/docs/welcome">Rosetta Spec</a>, some changes were added, mostly as metadata, as they contain Cardano specific information that needs to be either processed or returned.</p><p>To keep it easy, clear and upgradable for changes in the future, all specific metadata are added at the end of the API documentation.</p><p>To get a detailed view of the API and the changes, refer to the Rosetta API reference documentation.</p><h2><strong>Cardano Operation Types</strong></h2><p>Operations are used to represent components of transactions across the Rosetta API. They are returned from Data API endpoints and used by Construction API endpoints to build transactions.</p><p>Cardano Rosetta supports all operations available within the Cardano blockchain:</p><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p><code>Input</code> - Represents ADA or tokens being spent from a UTXO</p></li><li class="mb-1 mx-auto"><p><code>Output</code> - Represents ADA or tokens being sent to an address</p></li><li class="mb-1 mx-auto"><p><code>Stake_Key_Registration</code> - Registers a stake key for staking</p></li><li class="mb-1 mx-auto"><p><code>Stake_Key_Deregistration</code> - Deregisters a stake key</p></li><li class="mb-1 mx-auto"><p><code>Stake_Delegation</code> - Delegates a stake to a pool</p></li><li class="mb-1 mx-auto"><p><code>Withdrawal</code> - Withdraws rewards from a reward account</p></li><li class="mb-1 mx-auto"><p><code>Pool_Registration</code> - Registers a stake pool</p></li><li class="mb-1 mx-auto"><p><code>Pool_Retirement</code> - Retires a stake pool</p></li><li class="mb-1 mx-auto"><p><code>Vote_Registration</code> - Registers for voting (Catalyst)</p></li><li class="mb-1 mx-auto"><p><code>dRepVoteDelegation</code> - Delegates voting power to a Delegated Representative (DRep) for Cardano governance</p></li></ul><p>To support these operations, extra metadata is added to the standard Rosetta operation structure:</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">{\n  "withdrawalAmount": { "type": "Amount" },\n  "depositAmount": { "type": "Amount" },\n  "refundAmount": { "type": "Amount" },\n  "staking_credential": { "type": "PublicKey" },\n  "pool_key_hash": { "type": "string" },\n  "epoch": { "type": "number" },\n  "tokenBundle": { "type": "TokenBundleItem" },\n  "poolRegistrationCert": { "type": "string" },\n  "poolRegistrationParams": { "type": "PoolRegistrationParams" },\n  "voteRegistrationMetadata": { "type": "VoteRegistrationMetadata" },\n  "drep": { "type": "DRepObject" }\n}\n</code></pre><h2><strong>Endpoint specific changes</strong></h2><h3><code>/search/transactions</code></h3><p>Added <code>block_identifier</code> this enables the user to search for transactions within a particular block. Either index or hash must be set. If both are set from a different block, the returned list will be empty.</p><pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto"><code class="language-javascript">{\n  "block_identifier": {\n    "hash": "XXXXXX",\n    "index": "000"\n  }\n}\n</code></pre><p>This API can be disabled by setting <code>DISABLE_SEARCH_API</code> env variable to <code>t</code>, <code>true</code> or 1.</p><p>Max amount of transactions allowed to be requested is defined by <code>PAGE_SIZE</code> env variable, which is the same used at <code>/block/transaction</code> endpoint. Also, this value will be used if no limit parameter is received.</p><blockquote><p><strong>info</strong></p><p><code>status</code> and <code>success</code> filters are equivalent. If they are both set and they don't match, an error will be thrown. In the same way works <code>address</code> and <code>account_identifier.address</code>. <code>status</code> and <code>maxBlock</code> filters work as excluding filters, if they are set, besides operator value.</p></blockquote><p></p>	PUBLISHED	cmdmrjgo60001lc049k8z2c2d	2025-07-31 14:16:54.476	2025-07-31 14:16:54.477	0	0	0	0	https://github.com/cardano-foundation/cardano-rosetta-java
55e8219d-a86d-4d15-95b8-c98b651a02b3	About Cardano Vietnam Community	about-cardano-vietnam-community	<p></p><img class="max-w-full h-auto rounded-lg shadow-md mx-auto" src="https://camo.githubusercontent.com/8fb50015bc1858399776a905493ebf0357f7d2010f234e1956b71a7dc24b3c38/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f64646e63757861706d2f696d6167652f75706c6f61642f76313735333936313338302f63617264616e6f32766e5f6c6862676f6c2e706e67" alt="Cardano2VN"><p><strong>Cardano Vietnam (C2VN)</strong> is the official open-source hub and gathering place for Cardano enthusiasts, developers, and learners in Vietnam. We are dedicated to building a vibrant, supportive, and innovative Cardano ecosystem for the Vietnamese community.</p><h3><strong>Our Mission</strong></h3><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p><strong>Educate</strong>: Share knowledge, tutorials, and news about Cardano blockchain, smart contracts (Aiken, Plutus/Haskell), and decentralized technologies.</p></li><li class="mb-1 mx-auto"><p><strong>Connect</strong>: Bring together Cardano users, builders, and advocates from all backgrounds—whether you are a developer, investor, student, or simply curious.</p></li><li class="mb-1 mx-auto"><p><strong>Support</strong>: Help local projects, foster collaboration, and provide resources for anyone interested in Cardano.</p></li><li class="mb-1 mx-auto"><p><strong>Grow Together</strong>: Promote open-source values, transparency, and community-driven development.</p></li></ul><h3><strong>Get Involved</strong></h3><ul class="list-disc list-outside ml-6 mx-auto"><li class="mb-1 mx-auto"><p>Join our discussions and events (online and offline)</p></li><li class="mb-1 mx-auto"><p>Contribute articles, code, or ideas</p></li><li class="mb-1 mx-auto"><p>Help translate, review, or improve our resources</p></li><li class="mb-1 mx-auto"><p>Connect with us on social media and Cardano channels</p></li></ul><p><strong>Everyone is welcome—let's build the future of Cardano in Vietnam, together!</strong></p>	PUBLISHED	cmdq3d62j0007l404ytzvh7e6	2025-07-31 14:43:03.603	2025-07-31 14:43:03.604	0	0	0	0	https://github.com/independenceee/cardano2vn
\.


--
-- Data for Name: PostTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PostTag" ("postId", "tagId") FROM stdin;
86d7c5c0-6fef-40f1-8c61-b9cdc4b824d8	6cce66e7-e8b5-4739-a1f3-8559d60e4053
86d7c5c0-6fef-40f1-8c61-b9cdc4b824d8	21a5af1f-3185-4e18-a9cb-88e13f0ed2f6
f79fb404-c23e-4092-849b-cb2d7b5ded63	5fc0b774-64e3-4bb2-aa3a-e481a308f4e8
f92ba5c9-5bef-457d-a392-55e5aac41588	6cce66e7-e8b5-4739-a1f3-8559d60e4053
f92ba5c9-5bef-457d-a392-55e5aac41588	d961d893-4482-4c1d-be1a-58972d18f1bb
f92ba5c9-5bef-457d-a392-55e5aac41588	b32b9721-d03e-41d8-ab65-45700e804be6
f92ba5c9-5bef-457d-a392-55e5aac41588	5fc0b774-64e3-4bb2-aa3a-e481a308f4e8
e96656d8-8441-41fc-a50a-8d15f47018f1	6cce66e7-e8b5-4739-a1f3-8559d60e4053
e96656d8-8441-41fc-a50a-8d15f47018f1	21a5af1f-3185-4e18-a9cb-88e13f0ed2f6
31126b0c-fb73-456f-9f37-de0c766f5264	d961d893-4482-4c1d-be1a-58972d18f1bb
31126b0c-fb73-456f-9f37-de0c766f5264	b32b9721-d03e-41d8-ab65-45700e804be6
55e8219d-a86d-4d15-95b8-c98b651a02b3	5381c5fb-8209-4fc3-8219-a4ac5a00724d
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Project" (id, title, description, href, year, quarterly, fund, "createdAt", "updatedAt", status) FROM stdin;
bb5c6b41-d9f1-4573-b09b-a742d0d296c3	Community Review Dashboard for Proposals	Launch a dashboard to facilitate transparent and community-driven project reviews.	https://cardano.ideascale.com/c/idea/1000009	2025	Q2	F11	2025-07-28 07:15:15.531	2025-07-28 07:19:17.565	APPROVED
7decf837-3fe1-4c3f-9ade-f3ac00f83687	Decentralized Credential Verification System	Implement a smart contract-based system for verifying educational credentials on-chain.	https://cardano.ideascale.com/c/idea/1000002	2025	Q2	F11	2025-07-28 07:15:15.53	2025-07-28 07:19:27.75	PROPOSED
2c23cdcc-e594-45a7-a638-a9b7a9aee11f	Interactive Learning Hub for Smart Contracts	Create an engaging platform for learning smart contract development on Cardano using Aiken.	https://cardano.ideascale.com/c/idea/1000001	2025	Q2	F11	2025-07-28 07:15:15.53	2025-07-28 07:19:37.737	IN_PROGRESS
f834b7af-6c9a-40f2-9d83-b255910b08fb	Gamified Learning Path for Cardano Developers	Develop gamified challenges to enhance engagement in learning Cardano smart contracts.	https://cardano.ideascale.com/c/idea/1000006	2025	Q2	F11	2025-07-28 07:15:15.53	2025-07-28 07:19:43.761	COMPLETED
54932282-bfd1-4958-b29e-a82e6ef38abc	AI Assistant for Smart Contract Education	Integrate AI assistants into the Andamio platform to support self-paced learning.	https://cardano.ideascale.com/c/idea/1000008	2025	Q3	F12	2025-07-28 07:15:15.531	2025-07-28 07:19:52.534	PROPOSED
ca676beb-8bbf-4ed8-a19f-9c3303b6ac1e	Onboarding Platform for Smart Contract Developers	Design and launch a beginner-friendly onboarding platform for new Aiken developers.	https://cardano.ideascale.com/c/idea/1000004	2025	Q3	F12	2025-07-28 07:15:15.531	2025-07-28 07:19:58.101	IN_PROGRESS
10ceb9e5-3ded-4e42-897f-35f937bf66b6	Contribution Graph for Open-Source Projects	Visualize and reward contributions to Cardano open-source projects using Andamio.	https://cardano.ideascale.com/c/idea/1000005	2025	Q3	F12	2025-07-28 07:15:15.53	2025-07-28 07:20:07.623	APPROVED
4fde2f4f-9820-489b-8ba6-a7ec69eb2cea	Skill Tree Engine for DAOs	Build a skill tree engine to map contributor growth and roles in decentralized teams.	https://cardano.ideascale.com/c/idea/1000007	2024	Q1	F10	2025-07-28 07:15:15.531	2025-07-28 07:20:16.074	COMPLETED
cadaddba-b870-4b85-81d6-97bbce6873d4	DAOs <3 smart contracts for skill-acquisition and contribution tracking	Develop core Andamio smart contracts for skill-acquisition and contribution tracking	https://cardano.ideascale.com/c/idea/1000000	2024	Q1	F10	2025-07-28 07:15:15.53	2025-07-28 07:20:23.063	COMPLETED
a8e5da2c-391c-4ac3-9b66-f238d23299c9	NFT-based Learning Certificates	Issue NFTs as certificates for completing educational tasks and milestones.	https://cardano.ideascale.com/c/idea/1000003	2024	Q1	F10	2025-07-28 07:15:15.53	2025-07-28 07:20:28.838	COMPLETED
\.


--
-- Data for Name: Reaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Reaction" (id, "userId", "postId", type, "createdAt") FROM stdin;
2027ff3e-602f-4e78-922e-f27639d4fc44	cmdmrjgo60001lc049k8z2c2d	86d7c5c0-6fef-40f1-8c61-b9cdc4b824d8	HEART	2025-07-28 23:37:58.36
90f2da76-4972-45a1-82ee-e13591b3fb83	cmdmrjgo60001lc049k8z2c2d	f79fb404-c23e-4092-849b-cb2d7b5ded63	HEART	2025-07-29 01:23:56.5
e7d0aa8c-711c-42fa-a49a-b9de98ab22f5	cmdq3bbnh0003l404q0p3trio	f92ba5c9-5bef-457d-a392-55e5aac41588	WOW	2025-07-31 03:38:38.589
95e5bcf2-5ea5-4c21-9618-dfe999613b6f	cmdmrjgo60001lc049k8z2c2d	f92ba5c9-5bef-457d-a392-55e5aac41588	WOW	2025-07-31 05:37:39.332
887a67fa-8c12-479e-b55f-db0d105ca18c	cmdq3d62j0007l404ytzvh7e6	f92ba5c9-5bef-457d-a392-55e5aac41588	LIKE	2025-07-31 06:56:48.416
ca881771-8ad5-45d6-9e98-4b205f505f33	cmdq3d62j0007l404ytzvh7e6	55e8219d-a86d-4d15-95b8-c98b651a02b3	HEART	2025-08-01 03:25:59.394
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Role" (id, name, description) FROM stdin;
c4c24f13-64db-41eb-8a53-20286ba67197	ADMIN	\N
960778dc-870d-4140-a1ea-10978fbf94bc	USER	\N
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" (id, "userId", "accessTime", "lastAccess") FROM stdin;
cmdsjsokc0005ib04vr68k50n	cmdq3d62j0007l404ytzvh7e6	2025-08-01 08:14:44.316 2025-08-01 08:15:47.313
cmdsjef7v0019takgwubjwfx9	cmdmrjgo60001lc049k8z2c2d	2025-08-01 08:03:39.018 2025-08-01 08:03:46.676
cmdqukn2b0001kz04p5agumc1	cmdq3bbnh0003l404q0p3trio	2025-07-31 03:40:52.546 2025-07-31 03:40:52.546
cmdmr5yo40003taeg8eawcgbm	cmdmr5wjz0001taegi7z426dv	2025-07-28 06:54:24.195 2025-07-29 01:24:34.829
\.


--
-- Data for Name: Tab; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tab" (id, name, "isActive", "order", "createdAt", "updatedAt") FROM stdin;
3ae5a826-2800-4e6f-993d-d6cf4b7916f9	Blockchain	t	1	2025-08-01 04:18:39.258	2025-08-01 04:18:39.258
9be5c469-5097-4190-9ea5-d5fdbfe288d9	Web	t	2	2025-08-01 04:18:52.135	2025-08-01 04:18:52.135
e34fab58-cac3-4708-98ed-e88bae597a85	Game	t	3	2025-08-01 05:56:02.989	2025-08-01 05:56:02.989
a265278f-2d6f-4f42-bb20-2967a582a96e	Unity	t	4	2025-08-01 05:56:11.796	2025-08-01 05:56:11.796
978b105b-574e-4bd4-99a8-45ba6bf7f0e0	Aiken	t	5	2025-08-01 06:03:46.138	2025-08-01 06:03:46.138
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tag" (id, name, "createdAt") FROM stdin;
6cce66e7-e8b5-4739-a1f3-8559d60e4053	Hot search	2025-07-28 06:57:28.996
21a5af1f-3185-4e18-a9cb-88e13f0ed2f6	Cardano	2025-07-28 07:20:37.391
5381c5fb-8209-4fc3-8219-a4ac5a00724d	Cardano-utc	2025-07-28 07:20:48.04
c59896ff-67c2-4679-bdfa-97772e97df75	Ada	2025-07-28 07:20:56.539
d961d893-4482-4c1d-be1a-58972d18f1bb	Smart contract	2025-07-28 07:21:04.671
b32b9721-d03e-41d8-ab65-45700e804be6	CIP	2025-07-28 07:22:06.281
5fc0b774-64e3-4bb2-aa3a-e481a308f4e8	MCP	2025-07-29 00:39:16.292
5135ac18-5085-4b4c-8b3a-7c04cf15981e	日本語	2025-07-29 12:42:34.588
54cf9c31-766a-4959-a8c4-22a32c250e1d	Trợ từ A	2025-07-29 13:12:48.399
86d707e3-ad02-4370-8d4f-f2a0b903ad4b	hi	2025-08-01 05:27:09.885
\.


--
-- Data for Name: Technology; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Technology" (id, title, name, description, href, image, "createdAt", "updatedAt", "githubRepo") FROM stdin;
f1f14def-c78b-48f6-8a2a-0999f09a3d7d	Open source dynamic assets (Token/NFT) generator (CIP68)	The CIP68 Smart Contracts	A smart contract that allows users to create and manage dynamic assets on Cardano.	https://cip68.cardano2vn.io	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753686425/q1lpjq7kxknep8fotiv8.png	2025-07-28 07:07:07.4	2025-07-28 07:07:07.4	\N
993eceb6-0d49-4bc0-8418-12c4244a170d	Dualtarget for ADA-Holders (Staking and increasing assets) with a decentralized automated trading bot	The Dualtarget Smart Contracts	A smart contract that allows users to create and manage dynamic assets on Cardano.	https://dualtarget.xyz	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753784275/oywlnzdg5uazw4o4t3yc.png	2025-07-28 07:07:37.58	2025-07-31 14:31:47.823	https://github.com/cardano-foundation/cardano-rosetta-java
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, wallet, email, name, image, provider, "createdAt", "updatedAt", "roleId") FROM stdin;
cmdmr5wjz0001taegi7z426dv	addr1qxgsscq9s3nrf9qytug9lzmq49pm5vqk4wjcwn4ulfm7euqt6xdndmu3gshvpl4a6h74vswy34qrtt32p2d2pycg4nusd2g8hg	\N	Dao Manh Tung	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753685660/ppzsu25uebywdjkymqus.png	\N	2025-07-28 06:54:21.453	2025-07-28 06:59:00.137	c4c24f13-64db-41eb-8a53-20286ba67197
cmdmrjgo60001lc049k8z2c2d	\N	daomanhtung4102003@gmail.com	daomanh tung	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753940170/google-avatars/bscxjr3vclhg370m444d.jpg	google	2025-07-28 07:04:54.054	2025-07-31 05:36:10.833	c4c24f13-64db-41eb-8a53-20286ba67197
cmdq3bbnh0003l404q0p3trio	addr1q8r879mjnxd3gjqjdgjxkwzfcnvcgsve927scqk5fc3gfs2hs03pn7uhujentyhzq3ays72u4xtfrlahyjalujhxufsqw0yz5s	\N	Nguyen Duy Khanh	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753887467/hhsk5rjszag6v70yk4ve.png	\N	2025-07-30 14:57:48.221	2025-07-31 05:36:43.903	c4c24f13-64db-41eb-8a53-20286ba67197
cmdq3d62j0007l404ytzvh7e6	addr1q8yxhdkuzsexmuys95df4w57ytjj7h8mdaz7ca2l7d5z7prxjt02t3urmnuaym2gnv4wa2ah5rfjfpjuaakv9ac7j0dqg509wz	\N	Phan Dinh Nghia	http://res.cloudinary.com/dvw4ba58t/image/upload/v1753887553/kxs6i3f7v0zjzzbs4lxx.png	\N	2025-07-30 14:59:14.299	2025-07-31 06:57:20.826	c4c24f13-64db-41eb-8a53-20286ba67197
\.


--
-- Data for Name: VideoSection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VideoSection" (id, "videoId", "channelName", "videoUrl", title, "thumbnailUrl", "isFeatured", "createdAt", "updatedAt") FROM stdin;
25a607b4-b916-4789-93ca-91b4e4c25c24	fTma6WVg-qk	 Jono Catliff	https://www.youtube.com/watch?v=fTma6WVg-qk	Master n8n AI Agents in 2 Hours: Beginner’s Guide for 2025	https://i.ytimg.com/vi/fTma6WVg-qk/maxresdefault.jpg	f	2025-07-29 05:09:33.407	2025-07-29 05:09:33.407
32156b0b-e8d3-4e6a-b881-83a734571523	IZdbvFefFd4	Advait Vaishnav	https://www.youtube.com/watch?v=IZdbvFefFd4	Lovable 2.0 Masterclass: Build Real Projects with Supabase & n8n	https://i.ytimg.com/vi/IZdbvFefFd4/maxresdefault.jpg	f	2025-07-29 05:09:55.474	2025-07-29 05:09:55.474
9929a602-bb95-422f-805f-59b6f1b45d81	CP4VyckWlIg	Kia Ghasem	https://www.youtube.com/watch?v=CP4VyckWlIg	Automate Your Entire SEO for $1 (Free n8n Template)	https://i.ytimg.com/vi/CP4VyckWlIg/maxresdefault.jpg	f	2025-07-29 05:10:16.68	2025-07-29 05:10:16.68
8b36e216-6193-4ada-9f7e-baf168c54655	kEtYJOijCBM	 AI Foundations	https://www.youtube.com/watch?v=kEtYJOijCBM	How to Build AI Agents in n8n for Beginners! (Full n8n Guide)	https://i.ytimg.com/vi/kEtYJOijCBM/maxresdefault.jpg	f	2025-07-29 05:12:01.046	2025-07-29 05:12:01.046
7b718dba-768f-4478-9191-ec9f3fa0ed4a	r0c7RhMFcww	Nick Saraev	https://www.youtube.com/watch?v=r0c7RhMFcww	Build Your First AI Business in 6 Hours (Ultimate Beginner Guide)	https://i.ytimg.com/vi/r0c7RhMFcww/maxresdefault.jpg	t	2025-07-29 05:09:13.282	2025-07-29 05:37:05.657
\.


--
-- Name: AboutContent AboutContent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AboutContent"
    ADD CONSTRAINT "AboutContent_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: Member Member_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY (id);


--
-- Name: PostTag PostTag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PostTag"
    ADD CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "tagId");


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Reaction Reaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Tab Tab_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tab"
    ADD CONSTRAINT "Tab_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: Technology Technology_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Technology"
    ADD CONSTRAINT "Technology_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VideoSection VideoSection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VideoSection"
    ADD CONSTRAINT "VideoSection_pkey" PRIMARY KEY (id);


--
-- Name: AboutContent_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AboutContent_createdAt_idx" ON public."AboutContent" USING btree ("createdAt");


--
-- Name: AboutContent_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AboutContent_isActive_idx" ON public."AboutContent" USING btree ("isActive");


--
-- Name: Comment_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Comment_createdAt_idx" ON public."Comment" USING btree ("createdAt");


--
-- Name: Comment_postId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Comment_postId_idx" ON public."Comment" USING btree ("postId");


--
-- Name: Comment_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Comment_userId_idx" ON public."Comment" USING btree ("userId");


--
-- Name: Media_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Media_type_idx" ON public."Media" USING btree (type);


--
-- Name: Media_uploadedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Media_uploadedAt_idx" ON public."Media" USING btree ("uploadedAt");


--
-- Name: Media_uploadedBy_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Media_uploadedBy_idx" ON public."Media" USING btree ("uploadedBy");


--
-- Name: Member_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Member_createdAt_idx" ON public."Member" USING btree ("createdAt");


--
-- Name: Member_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Member_isActive_idx" ON public."Member" USING btree ("isActive");


--
-- Name: Member_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Member_order_idx" ON public."Member" USING btree ("order");


--
-- Name: Member_tabId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Member_tabId_idx" ON public."Member" USING btree ("tabId");


--
-- Name: Post_authorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Post_authorId_idx" ON public."Post" USING btree ("authorId");


--
-- Name: Post_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Post_createdAt_idx" ON public."Post" USING btree ("createdAt");


--
-- Name: Post_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Post_slug_idx" ON public."Post" USING btree (slug);


--
-- Name: Post_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Post_slug_key" ON public."Post" USING btree (slug);


--
-- Name: Post_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Post_status_idx" ON public."Post" USING btree (status);


--
-- Name: Project_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Project_createdAt_idx" ON public."Project" USING btree ("createdAt");


--
-- Name: Project_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Project_status_idx" ON public."Project" USING btree (status);


--
-- Name: Project_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Project_year_idx" ON public."Project" USING btree (year);


--
-- Name: Reaction_userId_postId_type_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Reaction_userId_postId_type_key" ON public."Reaction" USING btree ("userId", "postId", type);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: Tab_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tab_createdAt_idx" ON public."Tab" USING btree ("createdAt");


--
-- Name: Tab_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tab_isActive_idx" ON public."Tab" USING btree ("isActive");


--
-- Name: Tab_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tab_order_idx" ON public."Tab" USING btree ("order");


--
-- Name: Tag_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tag_name_idx" ON public."Tag" USING btree (name);


--
-- Name: Technology_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Technology_createdAt_idx" ON public."Technology" USING btree ("createdAt");


--
-- Name: User_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_createdAt_idx" ON public."User" USING btree ("createdAt");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_provider_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_provider_idx" ON public."User" USING btree (provider);


--
-- Name: User_wallet_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_wallet_key" ON public."User" USING btree (wallet);


--
-- Name: Comment Comment_parentCommentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Media Media_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Media Media_uploadedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Member Member_tabId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Member"
    ADD CONSTRAINT "Member_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES public."Tab"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PostTag PostTag_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PostTag"
    ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostTag PostTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PostTag"
    ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reaction Reaction_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reaction Reaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

