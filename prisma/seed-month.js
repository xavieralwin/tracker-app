const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const rawData = `
Citi bank Singapore	364888	Naveen C	GCPC-16209 Amendments made to CBOL	02/02/26	02/02/26	02/02/26			AEM	Landing page	Existing			6				
Citi bank Singapore	364844	Naveen C	GCPC-16256	02/02/26	02/02/26	02/02/26			AEM	Landing page	Existing			6				
Citi bank Singapore	364184	Naveen C	GCPC-16118	02/02/26	02/02/26	02/02/26			AEM	Landing page	Existing			16				
Citi bank Singapore	363951	Santhosh Kumar M	GCPC-16052	02/02/26	02/02/26	02/02/26	No	BAU	AEM	Landing page	Existing		DO9-5	10				
Citi bank Singapore	364543	Santhosh Kumar M	GCPC-16194	01/30/26	02/02/26	02/02/26			AEM	Landing page	Existing		DO4-4, DO5-2	8				
Citi bank Singapore		Kushagra Ankit	Prod	02/02/26	02/02/26	02/02/26	No	BAU	ICMS/AEM		Existing/New			12			PROD	
Citi bank Singapore	364797	Kushagra Ankit	GCPC-16252 Deletion of Expired CBOL Pages	02/02/26	02/02/26	02/02/26	No	BAU	ICMS	Deleted	Existing/New		DO7-1	1		QC	UAT	
Citi bank Singapore	364605	Kushagra Ankit	GCPC-16204 Update of CBOL BRE for Credit Card	01/30/26	02/02/26	02/02/26	No	BAU	ICMS	vanity/pdf	Existing/New		DO10-1,DO18-1	2		QC	UAT	
Citi bank Singapore	364784	Kushagra Ankit	Page Extension: GCPC-16244 Extend Expiry	02/02/26	02/02/26	02/02/26	No	BAU	ICMS	Landing page	Existing/New		DO4-2	2		QC		
Citi bank Singapore	364168	Kushagra Ankit	GCPC-16107 Image size optimisation	01/27/26	02/02/26	02/02/26	No	BAU	ICMS/AEM	Landing page	Existing/New		DO4-10,DO11-10	20		QC	onhold	
Citi bank Singapore	358400	Santhosh Kumar M	GCPC-14740	02/02/26	02/02/26	02/02/26	No	BAU	ICMS/AEM		Existing/New		DO-4-6	6				
Citi bank Singapore	364543	Prem Kumar	GCPC-16194	01/30/26	02/02/26	02/02/26			AEM	Landing page	Existing		DO4-4, DO5-2	8				
Citi bank Singapore	364382	Prem Kumar	GCPC-16166	01/28/26	02/02/26	02/02/26	No	BAU	ICMS/AEM	Landing page	Existing		DO101-1	15				
Citi bank Singapore		Prem Kumar	Tagging fixes	02/02/26	02/02/26	02/02/26	No	BAU	AEM	Landing page	Existing			8				
Citi bank Singapore	364783	Vinothavalli R	GCPC-16240 Mass Cards Complimentary Travel Insurance Cessation	02/02/26	02/02/26	02/02/26	No	BAU	ICMS/AEM	Landing page	Existing		DO102-2,DO4-2	4		QC		
Citi bank Singapore	364785	Vinothavalli R	GCPC-16247 Removal of campaign	02/02/26	02/02/26	02/02/26	No	BAU	AEM	Landing page	Existing		DO102-6	6		QC		
Citi bank Singapore	362651	Vinothavalli R	GCPC-15854 Removal of Airport T3 ATM in CBOL	01/09/26	02/02/26	02/02/26	No	BAU	Drupal/AEM	Landing page	Existing		DO23-2,DO102-1	3				
Citi bank Singapore		Vinothavalli R	Utilisatipon Tracker	02/02/26	02/02/26	02/02/26	No	BAU	Drupal/ICMS/AEM	Landingpage/ Pdf	Existing		DO4-10	10				
Citi bank Singapore	364458	Deepika	GCPC-16187 Always Ahead Page Update	02/02/26	02/02/26	02/02/26	No	BAU	ICMS	Landingpage/ Pdf	Existing		DO4-8	8				
Citi bank Singapore	362834	Deepika	GCPC-15864 Technical SEO updates: HTTP issues	02/02/26	02/02/26	02/02/26	No	BAU	Drupal/ICMS/AEM	Landingpage/ Pdf	Existing		DO57-35	35				
Citi bank Singapore	364335	Arunkumar	Citi SG - Akamai Rewrite, Rollback, Redirect - FebW1	01/29/26	01/29/26	02/02/26	No	BAU	Drupal/ICMS	Landing page	Existing			25				
Citi bank Singapore		Kushagra Ankit	Prod	02/03/26	02/03/26	02/03/26	No	BAU	ICMS/AEM		Existing/New			6			PROD	
Citi bank Singapore	364455	Kushagra Ankit	GCPC-16177 Inv-TD Bundle promo Vanity Link TnC Update	01/29/26	01/29/26	02/03/26	No	BAU	ICMS/AEM	Landing page	Existing/New		DO4-1,DO10-4,DO18-4	9		QC	Preview	
Citi bank Singapore	364605	Kushagra Ankit	GCPC-16204 Update of CBOL BRE for Credit Card	01/30/26	02/02/26	02/03/26	No	BAU	ICMS	vanity/pdf	Existing/New	1	DO10-1,DO18-1	2		QC	UAT	
Citi bank Singapore	364967	Kushagra Ankit	GCPC-16266 Q2'25 TNC Deletion	02/03/26	02/03/26	02/03/26	No	BAU	ICMS	Deleted	Existing/New		DO7-10	10		QC	UAT	
Citi bank Singapore	364993	Kushagra Ankit	Page Extension: GCPC-16282 CSL Finance Expirig Webpage Extension	02/03/26	02/03/26	02/03/26	No	BAU	ICMS	PDF	Existing/New		DO4-5	5				
Citi bank Singapore	365050	Kushagra Ankit	Page Extension & Ownership change: GCPC-16295 Keep - Feb&Mar2026	02/03/26	02/03/26	02/03/26	No	BAU	ICMS	PDF	Existing/New		DO4-1	1				
Citi bank Singapore	365036	Kushagra Ankit	Priority: GCPC-16284 All Deposits Campaigns	02/03/26	02/03/26	02/03/26	No	BAU	ICMS	PDF	New		DO10-1	1		QC	UAT	
Citi bank Singapore		Prem Kumar	Tagging fixes	02/02/26	02/02/26	02/03/26	No	BAU	AEM	Landing page	Existing			20				
Citi bank Singapore	364317	Prem Kumar	GCPC-16151 Feb'26 CG+ Shout out Rate	02/03/26	02/03/26	02/03/26	No	BAU	AEM/ICMS		Existing			4				
Citi bank Singapore		Prem Kumar	Prod	02/03/26	02/03/26	02/03/26	No	BAU	ICMS/AEM		Existing/New			6				
Citi bank Singapore	364184	Naveen C	GCPC-16118	02/02/26	02/02/26	02/03/26			AEM	Landing page	Existing			28				
Citi bank Singapore	364543	Santhosh Kumar M	GCPC-16194	02/02/26	02/02/26	02/03/26	No	BAU	AEM	Landing page	Existing			10				
Citi bank Singapore	362102	Santhosh Kumar M	GCPC-15816	02/02/26	02/02/26	02/03/26	No	BAU	Drupal/ICMS/AEM	Landing page	Existing			10				
Citi bank Singapore	364383	Santhosh Kumar M	GCPC-16167	02/02/26	02/02/26	02/03/26	No	BAU	AEM	Landing page	Existing			8				
Citi bank Singapore	364384	Santhosh Kumar M	GCPC-16168	02/02/26	02/02/26	02/03/26	No	BAU	AEM	Landing page	Existing			8				
Citi bank Singapore	364783	Vinothavalli R	GCPC-16240 Mass Cards Complimentary Travel Insurance Cessation	02/03/26	02/03/26	02/03/26	No	BAU	ICMS/AEM	Landing page	Existing		DO102-2,DO4-2	4				
Citi bank Singapore	364785	Vinothavalli R	GCPC-16247 Removal of campaign	02/03/26	02/03/26	02/03/26	No	BAU	AEM	Landing page	Existing		DO102-6	6				
Citi bank Singapore	364184	Vinothavalli R	GCPC-16118	02/02/26	02/02/26	02/03/26	No	BAU	AEM	Landing page	Existing			10				
Citi bank Singapore	364335	Arunkumar	Citi SG - Akamai Rewrite, Rollback, Redirect - FebW1	01/29/26	01/29/26	02/03/26	No	BAU	Drupal/ICMS	Landing page	Existing			25				
Citi bank Singapore	364786	Kushagra Ankit	GCPC-16248 Removal of PDF	02/02/26	02/04/26	02/04/26	No	BAU	AEM	Deleted	Existing		DO7-1	1		QC	Preview	
Citi bank Singapore		Kushagra Ankit	Prod	02/04/26	02/04/26	02/04/26	No	BAU	ICMS/AEM		Existing/New			14			PROD	
Citi bank Singapore	365110	Kushagra Ankit	Page Extension	02/04/26	02/04/26	02/04/26	No	BAU	ICMS	Landingpage/ Pdf	Existing/New		DO4-2	2				
Citi bank Singapore	364455	Kushagra Ankit	GCPC-16177 Inv-TD Bundle promo Vanity Link TnC Update	01/29/26	01/29/26	02/04/26	No	BAU	ICMS/AEM	Landingpage/ Pdf	Existing/New		DO10-2,DO18-2	4		QC	UAT	
Citi bank Singapore	365041	Prem Kumar	GCPC-16289	02/04/26	02/04/26	02/04/26	No	BAU	Drupal	Landing page	Existing			18				
Citi bank Singapore		Prem Kumar	Tagging fixes	02/04/26	02/04/26	02/04/26	No	BAU	ICMS	Landing page	Existing			6				
Citi bank Singapore	364382	Prem Kumar	GCPC-16166	01/28/26	02/02/26	02/02/26	No	BAU	ICMS/AEM	Landing page	Existing		DO101-1	8				
Citi bank Singapore	364543	Santhosh Kumar M	GCPC-16194	02/02/26	02/04/26	02/04/26	No	BAU	AEM	Deleted	Existing			2				
Citi bank Singapore	365116	Santhosh Kumar M	GCPC-16309	02/04/26	02/04/26	02/04/26	No	BAU	AEM	Deleted	Existing			20				
Citi bank Singapore	362102	Santhosh Kumar M	GCPC-15816	02/04/26	02/04/26	02/04/26	No	BAU	AEM	Deleted	Existing			4				
Citi bank Singapore	358400	Santhosh Kumar M	GCPC-14740	02/04/26	02/04/26	02/04/26	No	BAU	Drupal/ICMS/AEM	Deleted	Existing			10				
Citi bank Singapore	364783	Vinothavalli R	GCPC-16240 Mass Cards Complimentary Travel Insurance Cessation	02/02/26	02/04/26	02/04/26	No	BAU	ICMS/AEM	Landing page	Existing		DO102-2,DO4-2	4				
Citi bank Singapore	364543	Vinothavalli R	GCPC-16194	01/30/26	02/04/26	02/04/26	No	BAU	ICMS	Landing page	Existing		DO9-10	10				
Citi bank Singapore	365042	Vinothavalli R	GCPC-16294 Delete - Feb&Mar 2026	02/04/26	02/04/26	02/04/26	No	BAU	ICMS/AEM	Landing page	Existing		DO7-4,DO4-2	6				
Citi bank Singapore	364184	Naveen C	GCPC-16118	02/02/26	02/02/26	02/04/26			AEM	Landing page	Existing			20				
Citi bank Singapore	365275	Naveen C	GCPC-16321 Wealth First and Overall Deposits Page Updates	02/02/26	02/02/26	02/04/26			AEM	Landing page	Existing			8				
Citi bank Singapore	365041	Alwin	GCPC-16289	02/04/26	02/04/26	02/04/26	No	BAU	Drupal	Landing page	Existing			18				
Citi bank Singapore	364168	Kushagra Ankit	GCPC-16107 Image size optimisation	01/27/26	02/05/26	02/05/26	No	BAU	ICMS	Image	Existing		DO4-10,DO11-10	20		QC	UAT	
Citi bank Singapore		Kushagra Ankit	Prod	02/05/26	02/05/26	02/05/26	No	BAU	ICMS/AEM		Existing/New			8			PROD	
Citi bank Singapore	365023	Kushagra Ankit	GCPC-16286 RL information that belongs to Vivian and Lindsay - Deletion	02/03/26	02/05/26	02/05/26	No	BAU	ICMS	Deleted	Existing/New		DO7-9	9		QC	UAT	
Citi bank Singapore	365279	Deepika	GCPC-16330 Updating of Retention Pricing PDF	02/05/26	02/05/26	02/05/26	No	BAU	ICMS	PDF	Existing		DO4-4	4		QC	UAT	
Citi bank Singapore		Deepika	Broken link	02/05/26	02/05/26	02/05/26	No	BAU	Drupal/ICMS/AEM	PDF	Existing		DO57-25	25				
Citi bank Singapore	358400	Santhosh Kumar M	GCPC-14740	02/05/26	02/05/26	02/05/26	No	BAU	Drupal/ICMS/AEM	Deleted	Existing			8				
Citi bank Singapore	364543	Santhosh Kumar M	GCPC-16194	02/05/26	02/05/26	02/05/26	No	BAU	AEM	Landing page	Existing		DO9-2	4				
Citi bank Singapore	365116	Santhosh Kumar M	GCPC-16309	02/05/26	02/05/26	02/05/26	No	BAU	AEM	Deleted	Existing			4				
Citi bank Singapore	364382	Prem Kumar	GCPC-16166	01/28/26	02/02/26	02/05/26	No	BAU	ICMS/AEM	Landing page	Existing		DO101-1	8				
Citi bank Singapore	365041	Prem Kumar	GCPC-16289	02/04/26	02/04/26	02/05/26	No	BAU	Drupal	Landing page	Existing			18				
Citi bank Singapore	365275	Naveen C	GCPC-16321 Wealth First	02/02/26	02/02/26	02/05/26	No	BAU	AEM	Landing page	Existing			28				
Citi bank Singapore	364335	Arunkumar	Citi SG - Akamai Rewrite, Rollback, Redirect - FebW1	01/29/26	01/29/26	02/05/26	No	BAU	Drupal/ICMS	Landing page	Existing			25				
Citi bank Singapore	365227	Vinothavalli R	GCPC-16318 Page expiry extension	02/04/26	02/05/26	02/05/26	No	BAU	ICMS	Landing page	Existing		DO4-7	7				
Citi bank Singapore	365168	Vinothavalli R	GCPC-16312 Debit Card Page Deletion	02/04/26	02/05/26	02/05/26	No	BAU	ICMS	Landing page	Existing		DO7-1	1				
Citi bank Singapore	365229	Vinothavalli R	GCPC-16319 Commercial Cards Update	02/04/26	02/05/26	02/05/26	No	BAU	ICMS	Landing page	Existing		DO5-2,DO10-2	4				
Citi bank Singapore	362070	Vinothavalli R	GCPC-15803		02/04/26	02/04/26	02/05/26	No	BAU	Drupal/ICMS	Landing page	Existing		DO23-10.DO4-5	15				
Citi bank Singapore		Vinothavalli R	Prod	02/05/26	02/05/26	02/05/26	No	BAU	ICMS/AEM	Landing page	Existing/New		DO9-1,DO206-1	4			PROD	
Citi bank Singapore	365387	Vinothavalli R	GCPC-16317 Update Copyright Year	02/04/26	02/05/26	02/05/26	No	BAU	ICMS	Landing page	Existing		DO4-1	1				
Citi bank Singapore	365041	Alwin	GCPC-16289	02/04/26	02/04/26	02/05/26	No	BAU	Drupal	Landing page	Existing			18				
Citi bank Singapore	365278	Kushagra Ankit	Page Extension: GCPC-16329	02/05/26	02/06/26	02/06/26	No	BAU	ICMS	Landing page	Existing		DO4-1	1				
Citi bank Singapore	365319	Kushagra Ankit	Page Extension: GCPC-16333	02/05/26	02/06/26	02/06/26	No	BAU	ICMS	Landing page	Existing		DO4-1	1				
Citi bank Singapore	365333	Kushagra Ankit	Page Extension: GCPC-16341	02/05/26	02/06/26	02/06/26	No	BAU	ICMS	PDF	Existing		DO4-6	8				
Citi bank Singapore	365460	Kushagra Ankit	Page Extension: GCPC-16357	02/06/26	02/06/26	02/06/26	No	BAU	ICMS	PDF	Existing		DO4-1	1				
Citi bank Singapore	358400	Santhosh Kumar M	GCPC-14740	02/06/26	02/06/26	02/06/26	No	BAU	Drupal/ICMS/AEM	Deleted	Existing			6				
Citi bank Singapore	365275	Naveen C	GCPC-16321 Wealth First	02/02/26	02/02/26	02/06/26	No	BAU	AEM	Landing page	Existing			28				
Citi bank Singapore	365041	Alwin	GCPC-16289	02/04/26	02/04/26	02/06/26	No	BAU	Drupal	Landing page	Existing			18				
Citi bank Singapore	364335	Arunkumar	Citi SG - Akamai Rewrite, Rollback, Redirect - FebW1	01/29/26	01/29/26	02/06/26	No	BAU	Drupal/ICMS	Landing page	Existing			25				
`;

async function main() {
    console.log("Starting database seeding with month data...");

    // 1. Get existing users mapping
    const users = await prisma.user.findMany();
    const userMap = {};
    users.forEach(u => userMap[u.name.toLowerCase()] = u.id);

    const defaultPassword = await bcrypt.hash('password123', 10);

    const lines = rawData.trim().split('\n');
    let taskCount = 0;
    
    for (const line of lines) {
        const parts = line.split('\t');
        if (parts.length < 5) continue; // Skip dates headers etc

        const market = parts[0]?.trim();
        const almTaskNumber = parts[1]?.trim();
        let resourceNameInput = parts[2]?.trim();
        const wmrDescription = parts[3]?.trim();
        
        // Sometimes the resource name index shifts if market is missing or extra tabs
        // Simple heuristic: if resourceNameInput looks like a date or code, it might be shifted
        if (!resourceNameInput || resourceNameInput.match(/\d{2}\/\d{2}\/\d{2}/) || resourceNameInput.length < 2) {
             continue; // Skip invalid rows or date-only separator rows
        }

        const raisedDateStr = parts[4]?.trim();
        const startDateStr = parts[5]?.trim();
        const deliveredDateStr = parts[6]?.trim();
        const slaBreach = parts[7]?.trim() || "No";
        const type = parts[8]?.trim() || "BAU";
        const tool = parts[9]?.trim();
        const pageCategory = parts[10]?.trim();
        const existingNewPage = parts[11]?.trim();
        const noOfIterations = parts[12]?.trim();
        const jobType = parts[13]?.trim();
        const effort = parts[14]?.trim();
        const qcStatus = parts[16]?.trim();
        const currentStatus = parts[17]?.trim();

        function parseDate(dStr) {
            if (!dStr || dStr.length < 5) return null;
            // MM/DD/YY to YYYY-MM-DD
            const [m, d, y] = dStr.split('/');
            if (!m || !d || !y) return null;
            return new Date(`20${y}-${m}-${d}`);
        }

        const resourceName = resourceNameInput;
        let userId = userMap[resourceName.toLowerCase()];

        // Create user if not exists
        if (!userId) {
            console.log(`Creating missing user: ${resourceName}`);
            const newUser = await prisma.user.create({
                data: {
                    name: resourceName,
                    email: `${resourceName.replace(/\s+/g, '.').toLowerCase()}@tracker.com`,
                    password: defaultPassword,
                    role: 'USER'
                }
            });
            userId = newUser.id;
            userMap[resourceName.toLowerCase()] = userId;
        }

        await prisma.taskRecord.create({
            data: {
                market,
                almTaskNumber,
                resourceName,
                wmrDescription,
                raisedDate: parseDate(raisedDateStr),
                startDate: parseDate(startDateStr),
                deliveredDate: parseDate(deliveredDateStr),
                slaBreach,
                type,
                tool,
                pageCategory,
                existingNewPage,
                noOfIterations,
                jobType,
                changesCountEfforts: effort,
                qcStatus,
                currentStatus,
                userId
            }
        });
        taskCount++;
    }

    console.log(`Successfully seeded ${taskCount} task records.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
