$("div.list-group a").click(function(e) {
  e.preventDefault();
  //
  $(this).siblings('a.active').removeClass("active");
  $(this).addClass("active");
  //
  // var index = $(this).index();
  // $("div.settings-tab div.settings-tab-content").removeClass("active");
  // $("div.settings-tab div.settings-tab-content").eq(index).addClass("active");
});
