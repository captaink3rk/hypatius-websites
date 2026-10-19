HYPATIUS · SID 2026 website fix

Copy these into the ROOT of the hypati.us site in the repo (the same folder that holds
home.html, company.html and the site/ folder), keeping the folders exactly as they are:

  news.html                                   -> replaces the current news.html
  news/space-industry-days-2026.html          -> new file inside a news/ folder at the site root
                                                 (create the folder if it is not there)
  site/img/sid-2026-hero.jpg                  -> new file inside the existing site/img/ folder
  site/img/og-sid-2026-1200x630.jpg           -> new file inside the existing site/img/ folder

Then delete the stray copies from the last upload, which landed in the wrong place:
  news-space-industry-days-2026.html, sid-2026-hero.jpg, og-sid-2026-1200x630.jpg
  (at the site root, beside news.html)

Tip: GitHub's "Add files via upload" keeps folders only when you drag the folders in.
Choosing files with the file picker drops them all into one folder.

After deploy, check:
  https://hypati.us/news                              (SID card shows the spacecraft image)
  https://hypati.us/news/space-industry-days-2026     (QR target; loads with header image)
