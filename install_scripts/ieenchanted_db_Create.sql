/****** Object:  Database [IEEnchantedDB]    Script Date: 5/5/2025 5:00:28 PM ******/
CREATE DATABASE [IEEnchantedDB]  (EDITION = 'Basic', SERVICE_OBJECTIVE = 'Basic', MAXSIZE = 2 GB) WITH CATALOG_COLLATION = SQL_Latin1_General_CP1_CI_AS, LEDGER = OFF;
GO
ALTER DATABASE [IEEnchantedDB] SET COMPATIBILITY_LEVEL = 160
GO
ALTER DATABASE [IEEnchantedDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [IEEnchantedDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [IEEnchantedDB] SET ALLOW_SNAPSHOT_ISOLATION ON 
GO
ALTER DATABASE [IEEnchantedDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [IEEnchantedDB] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [IEEnchantedDB] SET  MULTI_USER 
GO
ALTER DATABASE [IEEnchantedDB] SET ENCRYPTION ON
GO
ALTER DATABASE [IEEnchantedDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [IEEnchantedDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 7), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 10, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
/*** The scripts of database scoped configurations in Azure should be executed inside the target database connection. ***/
GO
-- ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 8;
GO
/****** Object:  Table [dbo].[eventInfo]    Script Date: 5/5/2025 5:00:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[eventInfo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[eventType] [varchar](50) NOT NULL,
	[dayOfWeek] [int] NOT NULL,
	[timeOfEvent] [time](7) NOT NULL,
	[dateOfEvent] [date] NULL,
	[storeId] [int] NOT NULL,
	[meleeUrl] [varchar](100) NOT NULL,
	[signUpUrl] [varchar](200) NOT NULL,
	[cost] [varchar](10) NOT NULL,
	[notes] [varchar](500) NOT NULL,
	[title] [varchar](500) NOT NULL,
 CONSTRAINT [PK_eventInfo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[judgeInfo]    Script Date: 5/5/2025 5:00:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[judgeInfo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[preferredName] [varchar](100) NOT NULL,
	[contactMethod] [varchar](200) NULL,
	[lat] [varchar](100) NULL,
	[long] [varchar](100) NULL,
	[range] [int] NOT NULL,
	[blurb] [nvarchar](500) NULL,
	[isRoadWarrior] [bit] NOT NULL,
 CONSTRAINT [PK_judgeInfo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[stores]    Script Date: 5/5/2025 5:00:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[stores](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[region] [varchar](25) NOT NULL,
	[storename] [varchar](75) NOT NULL,
	[address] [varchar](100) NOT NULL,
	[phone] [varchar](25) NULL,
	[city] [varchar](50) NOT NULL,
	[sellsSingles] [bit] NOT NULL,
	[notes] [varchar](500) NULL,
	[latitude] [varchar](100) NULL,
	[longitude] [varchar](100) NULL,
 CONSTRAINT [PK_stores] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[storeURLs]    Script Date: 5/5/2025 5:00:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[storeURLs](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[storeId] [int] NOT NULL,
	[url] [varchar](150) NOT NULL,
 CONSTRAINT [PK_storeURLs] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 5/5/2025 5:00:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](25) NOT NULL,
	[passwordHash] [varchar](max) NOT NULL,
	[isSuperAdmin] [bit] NOT NULL,
	[storeOrganizer] [varchar](50) NULL,
 CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[stores] ADD  CONSTRAINT [DF_stores_sellsSingles]  DEFAULT ((0)) FOR [sellsSingles]
GO
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [DF_users_isSuperAdmin]  DEFAULT ((0)) FOR [isSuperAdmin]
GO
ALTER TABLE [dbo].[storeURLs]  WITH CHECK ADD  CONSTRAINT [FK_storeURLs_storeURLs] FOREIGN KEY([id])
REFERENCES [dbo].[storeURLs] ([id])
GO
ALTER TABLE [dbo].[storeURLs] CHECK CONSTRAINT [FK_storeURLs_storeURLs]
GO
ALTER DATABASE [IEEnchantedDB] SET  READ_WRITE 
GO
