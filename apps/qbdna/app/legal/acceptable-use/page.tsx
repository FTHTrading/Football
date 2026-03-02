export default function AcceptableUsePage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none text-uc-gray-300 leading-relaxed">
      <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
        Acceptable Use Policy
      </h1>
      <p className="text-xs text-uc-gray-500 mb-8">
        Last Updated: June 2025
      </p>

      <p>
        This Acceptable Use Policy (&quot;AUP&quot;) governs your use of the
        Under Center platform (&quot;Platform&quot;) and supplements the Terms
        of Service. Violation of this AUP may result in account suspension or
        termination.
      </p>

      {/* 1 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        1. General Conduct
      </h2>
      <p>You agree to use the Platform in a manner that is:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Lawful and consistent with all applicable federal, state, and local laws</li>
        <li>Respectful of the rights and dignity of other users</li>
        <li>Consistent with the educational and informational purpose of the Platform</li>
        <li>In compliance with all applicable NCAA, NAIA, conference, and institutional rules</li>
      </ul>

      {/* 2 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        2. Prohibited Activities
      </h2>
      <p>The following activities are strictly prohibited:</p>

      <h3 className="text-sm font-semibold text-uc-gray-200 mt-6 mb-2">
        2.1 Misrepresentation
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Creating fake athlete profiles or impersonating another person</li>
        <li>Falsifying athletic statistics, recruiting information, or eligibility status</li>
        <li>Misrepresenting institutional affiliation, authority, or role</li>
        <li>Presenting Platform-generated content as legal or compliance advice</li>
      </ul>

      <h3 className="text-sm font-semibold text-uc-gray-200 mt-6 mb-2">
        2.2 NIL-Specific Violations
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Using the Platform to facilitate pay-for-play arrangements or any
          transaction that conditions compensation on athletic performance or
          enrollment decisions
        </li>
        <li>
          Structuring deals designed to circumvent NIL disclosure requirements
          in any jurisdiction
        </li>
        <li>
          Contacting recruits or prospective student-athletes in violation of
          applicable recruiting rules
        </li>
        <li>
          Using Platform tools to facilitate transactions with minor athletes
          without proper guardian consent
        </li>
      </ul>

      <h3 className="text-sm font-semibold text-uc-gray-200 mt-6 mb-2">
        2.3 Technical Misuse
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Automated scraping, crawling, or data extraction beyond reasonable
          personal use
        </li>
        <li>
          Attempting to access accounts, systems, or data without authorization
        </li>
        <li>
          Uploading malware, viruses, or any code designed to disrupt Platform
          operations
        </li>
        <li>
          Circumventing access controls, rate limits, or usage restrictions
        </li>
        <li>
          Reverse-engineering, decompiling, or disassembling any Platform
          software
        </li>
      </ul>

      <h3 className="text-sm font-semibold text-uc-gray-200 mt-6 mb-2">
        2.4 Content Violations
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Posting or transmitting content that is defamatory, obscene,
          threatening, harassing, or discriminatory
        </li>
        <li>
          Sharing content that infringes intellectual property rights of third
          parties
        </li>
        <li>Publishing another user&apos;s personal information without consent</li>
        <li>
          Distributing spam, unsolicited commercial communications, or
          promotional material through Platform channels
        </li>
      </ul>

      {/* 3 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        3. Institutional User Responsibilities
      </h2>
      <p>
        Users accessing the Platform on behalf of an institution (university
        athletic department, NIL collective, brand, or agency) bear additional
        responsibilities:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Ensuring all authorized users within their organization are aware of
          and comply with this AUP
        </li>
        <li>
          Maintaining accurate organizational information and points of contact
        </li>
        <li>
          Promptly revoking access for individuals no longer authorized to act
          on behalf of the institution
        </li>
        <li>
          Reporting any suspected misuse or policy violations by users within
          their organization
        </li>
      </ul>

      {/* 4 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        4. Reporting Violations
      </h2>
      <p>
        If you become aware of any activity that violates this AUP, please
        report it to{" "}
        <span className="text-uc-cyan">compliance@undercenter.com</span>. All
        reports will be reviewed and investigated. Under Center reserves the
        right to take appropriate action, including but not limited to content
        removal, account suspension, and law enforcement referral.
      </p>

      {/* 5 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        5. Enforcement
      </h2>
      <p>
        Under Center reserves the right to investigate and take appropriate
        action against any user who violates this AUP. Actions may include:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Warning or formal notice</li>
        <li>Temporary suspension of account access</li>
        <li>Permanent account termination</li>
        <li>Content removal or modification</li>
        <li>
          Referral to appropriate legal authorities or governing bodies
        </li>
      </ul>
      <p className="mt-3">
        Enforcement decisions are made at Under Center&apos;s sole discretion and
        are not subject to appeal except as required by law.
      </p>

      {/* 6 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        6. Modifications
      </h2>
      <p>
        We may update this AUP from time to time. Material changes will be
        communicated through the Platform. Continued use of the Platform after
        notice constitutes acceptance of the updated policy.
      </p>

      {/* 7 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        7. Contact
      </h2>
      <p>
        For questions about this Acceptable Use Policy, contact us at{" "}
        <span className="text-uc-cyan">compliance@undercenter.com</span>.
      </p>
    </article>
  );
}
