using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AdDataProject.AdDataService;

namespace AdDataProject.Controllers
{
    public class AdDataServiceController : ApiController
    {
        public AdDataAggregation Get()
        {
            List<AdItem> ads=GetSampleAdData();
            List<AdItem> top5Ads = ads.GroupBy(r => new { r.AdId, r.BrandId, r.BrandName })
                                    .Select(g =>
                                           new AdItem
                                           {
                                               AdId = g.Key.AdId,
                                               BrandId = g.Key.BrandId,
                                               BrandName = g.Key.BrandName,
                                               NumPages = g.Sum(i => i.NumPages),
                                               Position = ""
                                           })
                                     .OrderByDescending(r => r.NumPages)
                                     .ThenBy(r => r.AdId)
                                     .ThenBy(r => r.BrandName).Take(5).ToList<AdItem>();
            List<AdItem> top5Brands = ads.GroupBy(r => new { r.BrandName, r.BrandId })
                                         .Select(g =>
                                                new AdItem
                                                {
                                                    AdId = 0,
                                                    BrandId = g.Key.BrandId,
                                                    BrandName = g.Key.BrandName,
                                                    NumPages = g.Sum(i => i.NumPages),
                                                    Position = ""
                                                })
                                          .OrderByDescending(r => r.NumPages)
                                          .ThenBy(r => r.BrandName).Take(5).ToList<AdItem>();
            return new AdDataAggregation { AdItems = ads, Top5Ads = top5Ads, Top5Brands = top5Brands };
        }

        private List<AdItem> GetSampleAdData()
        {
            AdDataServiceClient adDataServiceClient = new AdDataServiceClient();
            var Ads = adDataServiceClient.GetAdDataByDateRange(new DateTime(2011, 1, 1), new DateTime(2011, 4, 1)).AsEnumerable<Ad>();
            var adItems = from ad in Ads
                            select new AdItem { AdId = ad.AdId, BrandId = ad.Brand.BrandId, BrandName = ad.Brand.BrandName, NumPages = ad.NumPages, Position = ad.Position };
            return adItems.ToList<AdItem>();
        }
    }
    public class AdItem
    {
        public int AdId{set;get;}
        public int BrandId{set; get;}
        public string BrandName { set; get; }
        public decimal NumPages { set; get; }
        public string Position { set; get; }
    }

    public class AdDataAggregation
    {
        public List<AdItem> AdItems { get; set; }
        public List<AdItem> Top5Ads { get; set; }
        public List<AdItem> Top5Brands { get; set; }
    }
}
