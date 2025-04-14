const { PrismaClient, Role, Category } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
	await prisma.user.createMany({
		data: [
			{
				user_id: 1,
				name: "Alice",
				last_name: "Smith",
				email: "alice@example.com",
				password: "pass1",
				role: Role.ASKER,
				created_at: new Date()
			},
			{
				user_id: 2,
				name: "Bob",
				last_name: "Brown",
				email: "bob@example.com",
				password: "pass2",
				role: Role.RESPONDER,
				created_at: new Date()
			},
			{
				user_id: 3,
				name: "Charlie",
				last_name: "Clark",
				email: "charlie@example.com",
				password: "pass3",
				role: Role.ADMIN,
				created_at: new Date()
			},
			{
				user_id: 4,
				name: "Diana",
				last_name: "White",
				email: "diana@example.com",
				password: "pass4",
				role: Role.ASKER,
				created_at: new Date()
			},
			{
				user_id: 5,
				name: "Eve",
				last_name: "Black",
				email: "eve@example.com",
				password: "pass5",
				role: Role.RESPONDER,
				created_at: new Date()
			},
			{
				user_id: 6,
				name: "Frank",
				last_name: "Green",
				email: "frank@example.com",
				password: "pass6",
				role: Role.ADMIN,
				created_at: new Date()
			}
		]
	});

	for (let i = 1; i <= 6; i++) {
		await prisma.survey.create({
			data: {
				survey_id: i,
				title: `Survey ${i}`,
				description: `Description for survey ${i}`,
				created_at: new Date(),
				authorId: (i - 1) % 6 + 1
			}
		});
	}
	for (let i = 1; i <= 6; i++) {
		await prisma.question.create({
			data: {
				question_id: i,
				title: `Question ${i}`,
				category: Category.TECHNOLOGY,
				surveyId: (i - 1) % 6 + 1,
				authorId: (i - 1) % 6 + 1
			}
		});
	}

	for (let i = 1; i <= 6; i++) {
		await prisma.answer.create({
			data: {
				answer_Id: i,
				text: `Answer ${i}`,
				created_at: new Date(),
				authorId: (i - 1) % 6 + 1,
				surveyId: (i - 1) % 6 + 1,
				questionId: (i - 1) % 6 + 1
			}
		});
	}

	for (let i = 1; i <= 6; i++) {
		await prisma.survey_Video.create({
			data: {
				servey_video_id: i,
				question_link: `https://video.example.com/q${i}`,
				surveyId: (i - 1) % 6 + 1,
				uploaderId: (i - 1) % 6 + 1
			}
		});
	}

	console.log("Database seeded successfully!");
}

main()
	.catch(e => {
		console.error("Error seeding data:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
