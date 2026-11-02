<?xml version="1.0" encoding="UTF-8"?>
<!-- Browser view of the XML sitemaps (the Yoast-style index and its typed sitemaps).
     Search engines read the XML; this only makes it readable for people. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="sitemap xhtml">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex, follow"/>
        <title>XML Sitemap — The AMN</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #3c3936; background: #f6f5f2; }
          #header { background: #141414; color: #fff; padding: 22px 30px; border-bottom: 3px solid #38b6ff; }
          #header h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
          #header h1 span { color: #38b6ff; }
          #header p { font-size: 13px; opacity: .8; margin-top: 4px; }
          #header a { color: #38b6ff; }
          #content { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
          .intro { background: #fff; border-left: 4px solid #38b6ff; padding: 14px 18px; margin-bottom: 24px; border-radius: 6px; font-size: 13px; color: #6b665f; line-height: 1.6; }
          .intro a { color: #0a7cc2; }
          .count { margin: 0 0 12px; font-size: 13px; color: #6b665f; }
          .count strong { color: #141414; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(20,20,20,.08); }
          thead tr { background: #141414; color: #fff; }
          thead th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
          tbody tr:nth-child(even) { background: #faf9f7; }
          tbody tr:hover { background: #e3f4ff; }
          tbody td { padding: 11px 16px; border-bottom: 1px solid #ecebe8; font-size: 13px; vertical-align: middle; }
          tbody td a { color: #0a7cc2; text-decoration: none; word-break: break-all; }
          tbody td a:hover { text-decoration: underline; }
          .lang { display: inline-block; margin: 0 4px 2px 0; padding: 2px 8px; border-radius: 20px; background: #e3f4ff; color: #0a7cc2; font-size: 11px; font-weight: 600; text-transform: uppercase; }
          .muted { color: #b0aaa2; }
          #footer { text-align: center; margin: 30px 0 24px; font-size: 12px; color: #9a948c; }
          #footer a { color: #6b665f; }
        </style>
      </head>
      <body>
        <div id="header">
          <h1><span>The</span> AMN — XML Sitemap</h1>
          <p>Business growth and investment network · <a href="https://theamn.network/">theamn.network</a></p>
        </div>

        <div id="content">
          <p class="intro">
            This XML Sitemap is used by search engines such as Google to discover the pages on this website.
            More about XML sitemaps at <a href="https://www.sitemaps.org/" target="_blank" rel="noopener">sitemaps.org</a>.
          </p>

          <!-- SITEMAP INDEX -->
          <xsl:if test="//sitemap:sitemapindex">
            <p class="count">This sitemap index contains <strong><xsl:value-of select="count(//sitemap:sitemap)"/></strong> sitemaps.</p>
            <table>
              <thead>
                <tr>
                  <th>Sitemap</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="//sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><xsl:value-of select="concat(substring(sitemap:lastmod, 1, 10), ' ', substring(sitemap:lastmod, 12, 5))"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>

          <!-- URL SET -->
          <xsl:if test="//sitemap:urlset">
            <p class="count">This sitemap contains <strong><xsl:value-of select="count(//sitemap:url)"/></strong> URLs. <a href="/sitemap_index.xml" style="color:#0a7cc2">← Sitemap index</a></p>
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Priority</th>
                  <th>Change Frequency</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="//sitemap:urlset/sitemap:url">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><xsl:value-of select="sitemap:priority"/></td>
                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                    <td><xsl:value-of select="concat(substring(sitemap:lastmod, 1, 10), ' ', substring(sitemap:lastmod, 12, 5))"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>

        <div id="footer">The AMN · <a href="https://theamn.network/">theamn.network</a></div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
